import { VariableEventPacket } from '../Variable'

import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import { EventPacket, getVariableFromNode } from '../../utils'
import {
  FormulaNode,
  NodeValueType,
  parse,
  predictNodeValueType,
} from '../../utils'
import { ReferrableVariable } from '../ReferrableVariable'
import { NumberValue, VectorValue } from '../Variable'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'
import EventDispatcher from '../../utils/EventDispatcher'
import { GlobalFormulaVariable } from './GlobalFormulaVariable'

export type FormulaManagerState =
  | {
      type: 'ACTIVE'
      formulaObjectInfo: FormulaObjectInfo
      valueType: NodeValueType
    }
  | {
      type: 'INVALID_FORMULA'
      error: string
    }
  | {
      type: 'TYPE_PREDICTION_FAILED'
      error: string
      problemNode: FormulaNode
      formulaNode: FormulaNode
    }
  | {
      type: 'RECURSIVE_FORMULA'
      detectedPath: string[]
      formulaNode: FormulaNode
    }
  | {
      type: 'INITIALIZING'
    }
  | {
      type: 'CHECKING_RECURSIVE_FORMULA'
      formulaNode: FormulaNode
    }

export type FormulaManagerEventPacket =
  | VariableEventPacket
  | EventPacket<'RECURSIVE_FORMULA_DETECTED', string[]>
export class FormulaManager {
  private objectInfoManager: ObjectInfoManager
  private variableConnectorStorage: VariableConnectorStorage
  private variableStorage: VariableStorage
  private state: FormulaManagerState
  dispatcher = new EventDispatcher<FormulaManagerEventPacket>()
  value: NumberValue | VectorValue
  formula: string
  ref?: string

  constructor(
    formula: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    ref?: string
  ) {
    this.objectInfoManager = objectInfoManager
    this.variableConnectorStorage = variableConnectorStorage
    this.variableStorage = variableStorage
    this.state = {
      type: 'INITIALIZING',
    }
    this.value = new NumberValue(0)
    this.formula = '0'
    this.ref = ref

    this.updateFormula(formula)
  }

  getState() {
    return this.state
  }

  onFormulaObjectInfoDataValueUpdate = () => {
    if (this.state.type === 'ACTIVE') {
      if (
        typeof this.state.formulaObjectInfo.value === 'number' &&
        this.value instanceof NumberValue
      ) {
        this.value.set(this.state.formulaObjectInfo.value)
        return
      }

      if (
        Array.isArray(this.state.formulaObjectInfo.value) &&
        this.value instanceof VectorValue
      ) {
        this.value.set(this.state.formulaObjectInfo.value)
        return
      }
    }
  }

  reset() {
    if (
      this.state.type === 'ACTIVE' ||
      this.state.type === 'TYPE_PREDICTION_FAILED' ||
      this.state.type === 'RECURSIVE_FORMULA' ||
      this.state.type === 'CHECKING_RECURSIVE_FORMULA'
    ) {
      // get referred variables
      let node: FormulaNode
      if (this.state.type === 'ACTIVE') {
        node = this.state.formulaObjectInfo.getFormulaNode()
      } else {
        node = this.state.formulaNode
      }

      let referredVariables: ReferrableVariable[] = []
      for (const variable of getVariableFromNode(node)) {
        const variableInfo = this.variableStorage.getVariableByRef(variable)
        if (variableInfo === null) continue
        referredVariables.push(variableInfo)
      }

      for (const variable of referredVariables) {
        variable.dispatcher.removeListener(
          'VALUE_TYPE_CHANGED',
          this.onReferredVariableValueTypeChange
        )
        variable.dispatcher.removeListener(
          'RECURSIVE_FORMULA_DETECTED',
          this.onReferredVariableRecursiveFormulaDetected
        )
      }
    }

    if (this.state.type === 'ACTIVE') {
      this.variableConnectorStorage.deleteObjectConnectors(
        this.state.formulaObjectInfo.config.id
      )
      this.state.formulaObjectInfo.eventDispatcher.removeListener(
        'FORMULA_VALUE_UPDATE',
        this.onFormulaObjectInfoDataValueUpdate
      )
      this.objectInfoManager.objectInfoStorage.delete(
        this.state.formulaObjectInfo.config.id
      )
    }

    // In initializing state, the value isn't correct.
    this.state = {
      type: 'INITIALIZING',
    }
  }

  onReferredVariableValueTypeChange = () => {
    this.updateFormula(this.formula)
  }

  onReferredVariableRecursiveFormulaDetected = (path: string[]) => {
    if (this.state.type === 'RECURSIVE_FORMULA') {
      const isInRecursiveCycle = compareRecursivePath(
        this.state.detectedPath,
        path
      )
      if (isInRecursiveCycle) {
        return
      }
    }

    this.updateFormula(this.formula)
  }

  updateFormula(formula: string) {
    // get current state before beingreset
    const currentState = this.state
    const currentValueType: NodeValueType =
      currentState.type === 'ACTIVE' ? currentState.valueType : 'NUMBER'

    // reset state - remove referred variable
    this.reset()

    // parse formula
    const parseResult = parse(formula)
    if (parseResult.status === 'ERROR') {
      this.state = {
        type: 'INVALID_FORMULA',
        error: parseResult.error,
      }
      this.formula = formula

      // check if value type changed
      if (currentValueType !== 'NUMBER') {
        this.value = new NumberValue(0)
        this.dispatcher.dispatch('VALUE_TYPE_CHANGED', 'NUMBER')
      }
      return
    }

    // get referred variables
    let referredVariables: ReferrableVariable[] = []

    for (const variable of getVariableFromNode(parseResult.data)) {
      const variableInfo = this.variableStorage.getVariableByRef(variable)
      if (variableInfo === null) continue
      referredVariables.push(variableInfo)
    }

    // check recursive formula

    // set up referred variables event
    for (const variable of referredVariables) {
      if (variable.ref === this.ref) continue
      variable.dispatcher.addListener(
        'VALUE_TYPE_CHANGED',
        this.onReferredVariableValueTypeChange
      )
      variable.dispatcher.addListener(
        'RECURSIVE_FORMULA_DETECTED',
        this.onReferredVariableRecursiveFormulaDetected
      )
    }

    // predict value type
    const predictResult = predictNodeValueType(parseResult.data, ref => {
      const variable = this.variableStorage.getVariableByRef(ref)
      if (variable === null) return null
      return variable.value.valueType
    })
    if (predictResult.status === 'FAIL') {
      this.state = {
        type: 'TYPE_PREDICTION_FAILED',
        error: predictResult.error,
        problemNode: predictResult.problemNode,
        formulaNode: parseResult.data,
      }
      this.formula = formula
      // check if value type changed
      if (currentValueType !== 'NUMBER') {
        this.value = new NumberValue(0)
        this.dispatcher.dispatch('VALUE_TYPE_CHANGED', 'NUMBER')
      }
      return
    }

    // set value of this formula
    if (predictResult.info.value === 'NUMBER') {
      if (!(this.value instanceof NumberValue)) {
        this.value = new NumberValue(0)
      }
    } else {
      if (!(this.value instanceof VectorValue)) {
        this.value = new VectorValue([])
      }
    }

    // check recursive formula
    this.state = {
      type: 'CHECKING_RECURSIVE_FORMULA',
      formulaNode: parseResult.data,
    }
    const detectedPath = checkRecursiveFormula(
      new Set(referredVariables.map(v => v.ref)),
      new Set(),
      this.variableStorage,
      this.ref
    )

    if (detectedPath !== null) {
      this.state = {
        type: 'RECURSIVE_FORMULA',
        detectedPath: detectedPath,
        formulaNode: parseResult.data,
      }
      this.formula = formula

      // check if value type changed
      if (currentValueType !== 'NUMBER') {
        this.value = new NumberValue(0)
        this.dispatcher.dispatch('VALUE_TYPE_CHANGED', 'NUMBER')
      }

      this.dispatcher.dispatch('RECURSIVE_FORMULA_DETECTED', detectedPath)
      return
    }

    // create formula object info
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo(
        parseResult.data,
        predictResult.info.value === 'NUMBER' ? 0 : [0, 0, 0]
      )

    formulaObjectInfo.eventDispatcher.addListener(
      'FORMULA_VALUE_UPDATE',
      this.onFormulaObjectInfoDataValueUpdate
    )

    // set up initial data
    for (const variable of referredVariables) {
      formulaObjectInfo.setValue([variable.ref], variable.value.get())
    }

    // set up connector
    for (const variable of referredVariables) {
      this.variableConnectorStorage.connectVariableToObjectInfo(
        variable,
        formulaObjectInfo,
        [variable.ref]
      )
    }

    // set data
    this.formula = formula
    this.state = {
      type: 'ACTIVE',
      formulaObjectInfo: formulaObjectInfo,
      valueType: predictResult.info.value,
    }

    if (currentValueType !== predictResult.info.value) {
      this.dispatcher.dispatch('VALUE_TYPE_CHANGED', this.state.valueType)
    }
  }

  destroy() {
    this.reset()
  }
}

function checkRecursiveFormula(
  referredVariableRefs: Set<string>,
  visitedVariableRefs: Set<string>,
  variableStorage: VariableStorage,
  variableRef?: string
): string[] | null {
  if (variableRef !== undefined && visitedVariableRefs.has(variableRef))
    return [variableRef]

  for (const referredVariableRef of referredVariableRefs) {
    const referredVariable =
      variableStorage.getVariableByRef(referredVariableRef)
    if (!(referredVariable instanceof GlobalFormulaVariable)) continue
    const state = referredVariable.formulaManager.getState()

    let node: FormulaNode | null = null
    if (state.type === 'RECURSIVE_FORMULA') {
      node = state.formulaNode
    }
    if (state.type === 'TYPE_PREDICTION_FAILED') {
      node = state.formulaNode
    }
    if (state.type === 'ACTIVE') {
      node = state.formulaObjectInfo.getFormulaNode()
    }

    if (state.type === 'CHECKING_RECURSIVE_FORMULA') {
      node = state.formulaNode
    }

    if (node === null) continue

    const result = checkRecursiveFormula(
      new Set(getVariableFromNode(node)),
      new Set(
        variableRef === undefined
          ? visitedVariableRefs
          : [...visitedVariableRefs, variableRef]
      ),
      variableStorage,
      referredVariable.ref
    )
    if (result === null) continue

    if (variableRef === undefined) return result

    return [variableRef, ...result]
  }

  return null
}

function compareRecursivePath(path1: string[], path2: string[]): boolean {
  const cleanPath1 = path1.slice(0, path1.length - 1)
  const cleanPath2 = path2.slice(0, path2.length - 1)
  if (cleanPath1.length === 0) return false
  if (cleanPath2.length === 0) return false
  if (cleanPath1.length !== cleanPath2.length) return false
  const start = cleanPath1[0]
  const indexOffset = cleanPath2.findIndex(value => value === start)
  if (indexOffset === -1) return false
  for (let i = 0; i < cleanPath1.length; i++) {
    if (cleanPath1[i] !== cleanPath2[(i + indexOffset) % cleanPath2.length])
      return false
  }
  return true
}
