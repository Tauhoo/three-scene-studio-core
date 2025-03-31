import { VariableEventPacket } from '../Variable'

import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import { getVariableFromNode } from '../../utils'
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
    }
  | {
      type: 'INITIALIZING'
    }

export class FormulaManager {
  private objectInfoManager: ObjectInfoManager
  private variableConnectorStorage: VariableConnectorStorage
  private variableStorage: VariableStorage
  private state: FormulaManagerState
  dispatcher = new EventDispatcher<VariableEventPacket>()
  value: NumberValue | VectorValue
  formula: string

  constructor(
    formula: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    this.objectInfoManager = objectInfoManager
    this.variableConnectorStorage = variableConnectorStorage
    this.variableStorage = variableStorage
    this.state = {
      type: 'INITIALIZING',
    }
    this.value = new NumberValue(0)
    this.formula = '0'

    this.updateFormula(formula)
  }

  onValueTypeChange = (value: any) => {
    if (this.state.type === 'ACTIVE') {
      if (typeof value === 'number' && this.value instanceof NumberValue) {
        this.value.set(value)
      } else if (Array.isArray(value) && this.value instanceof VectorValue) {
        this.value.set(value)
      }
    }
  }

  reset() {
    if (this.state.type === 'ACTIVE') {
      // get referred variables
      let referredVariables: ReferrableVariable[] = []
      for (const variable of getVariableFromNode(
        this.state.formulaObjectInfo.getFormulaNode()
      )) {
        const variableInfo = this.variableStorage.getVariableByRef(variable)
        if (variableInfo === null) continue
        referredVariables.push(variableInfo)
      }

      for (const variable of referredVariables) {
        variable.dispatcher.removeListener(
          'VALUE_TYPE_CHANGED',
          this.onReferredVariableValueTypeChange
        )
      }

      this.variableConnectorStorage.deleteObjectConnectors(
        this.state.formulaObjectInfo.config.id
      )
      this.state.formulaObjectInfo.eventDispatcher.removeListener(
        'FORMULA_VALUE_UPDATE',
        this.onValueTypeChange
      )
      this.objectInfoManager.objectInfoStorage.delete(
        this.state.formulaObjectInfo.config.id
      )
    }
    this.state = {
      type: 'INITIALIZING',
    }
    this.value = new NumberValue(0)
  }

  onReferredVariableValueTypeChange = () => {
    this.updateFormula(this.formula)
  }

  updateFormula(formula: string) {
    // reset state
    this.reset()
    this.formula = formula

    // parse formula
    const parseResult = parse(formula)
    if (parseResult.status === 'ERROR') {
      this.state = {
        type: 'INVALID_FORMULA',
        error: parseResult.error,
      }
      return
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
      }
      return
    }

    // check if value type changed
    const valueTypeChanged =
      this.state.type === 'ACTIVE' &&
      this.state.valueType !== predictResult.info.value

    // create formula object info
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo(
        { type: 'NUMBER', value: 0, text: '0', id: 'temp' },
        0
      )

    // get referred variables
    let referredVariables: ReferrableVariable[] = []
    for (const variable of getVariableFromNode(parseResult.data)) {
      const variableInfo = this.variableStorage.getVariableByRef(variable)
      if (variableInfo === null) continue
      referredVariables.push(variableInfo)
    }

    // set up referred variables type changing event
    for (const variable of referredVariables) {
      variable.dispatcher.addListener(
        'VALUE_TYPE_CHANGED',
        this.onReferredVariableValueTypeChange
      )
    }

    // set up initial data
    for (const variable of referredVariables) {
      formulaObjectInfo.setValue([variable.ref], variable.value)
    }

    // set up connector
    for (const variable of referredVariables) {
      this.variableConnectorStorage.connectVariableToObjectInfo(
        variable,
        formulaObjectInfo,
        [variable.ref]
      )
    }

    this.state = {
      type: 'ACTIVE',
      formulaObjectInfo: formulaObjectInfo,
      valueType: predictResult.info.value,
    }
    if (this.state.valueType === 'NUMBER') {
      this.value = new NumberValue(0)
    } else {
      this.value = new VectorValue([])
    }

    if (valueTypeChanged) {
      this.dispatcher.dispatch('VALUE_TYPE_CHANGED', this.state.valueType)
    }

    return
  }

  destroy() {
    this.reset()
  }
}
