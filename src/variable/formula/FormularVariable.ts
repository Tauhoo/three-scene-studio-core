import * as z from 'zod'
import {
  NumberValue,
  Variable,
  VariableEventPacket,
  VectorValue,
} from '../Variable'
import EventDispatcher from '../../utils/EventDispatcher'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { ReferrableVariable } from '../ReferrableVariable'
import { VariableStorage } from '../VariableStorage'
import { errorResponse, getVariableFromNode } from '../../utils'

export const formulaVariableConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  value: z.union([z.number(), z.array(z.number())]),
  formula: z.string(),
  valueType: z.union([z.literal('NUMBER'), z.literal('VECTOR')]),
})

export type FormulaVariableConfig = z.infer<typeof formulaVariableConfigSchema>

export class FormulaVariable extends Variable {
  type: 'FORMULA' = 'FORMULA'
  group: 'PRIVATE' = 'PRIVATE'
  dispatcher = new EventDispatcher<VariableEventPacket>()
  private formulaObjectInfo: FormulaObjectInfo
  private objectInfoManager: ObjectInfoManager
  private variableConnectorStorage: VariableConnectorStorage
  private variableStorage: VariableStorage

  value: NumberValue | VectorValue

  getFormulaObjectInfo() {
    return this.formulaObjectInfo
  }

  constructor(
    formulaObjectInfo: FormulaObjectInfo,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    super(id)
    if (typeof formulaObjectInfo.value === 'number') {
      this.value = new NumberValue(formulaObjectInfo.value)
    } else {
      this.value = new VectorValue(formulaObjectInfo.value)
    }
    this.variableStorage = variableStorage
    this.variableConnectorStorage = variableConnectorStorage
    this.objectInfoManager = objectInfoManager
    this.formulaObjectInfo = formulaObjectInfo
    this.formulaObjectInfo.eventDispatcher.addListener(
      'FORMULA_VALUE_UPDATE',
      this.onFormulaValueUpdate
    )
    this.formulaObjectInfo.eventDispatcher.addListener(
      'FORMULA_INFO_UPDATE',
      this.updateReferredVariables
    )
    this.updateReferredVariables({ valueTypeChange: false })
  }

  private onFormulaValueUpdate = ({ value }: { value: number | number[] }) => {
    if (typeof value === 'number' && this.value instanceof NumberValue) {
      this.value.set(value)
    } else if (Array.isArray(value) && this.value instanceof VectorValue) {
      this.value.set(value)
    }
  }

  updateReferredVariables = (data: { valueTypeChange: boolean }) => {
    const info = this.formulaObjectInfo.getFormulaInfo()
    const variableRefs = getVariableFromNode(info.node)

    // clear old referred variables
    this.variableConnectorStorage.deleteObjectConnectors(
      this.formulaObjectInfo.config.id
    )

    // get variables
    let variables: ReferrableVariable[] = []
    for (const variable of variableRefs) {
      const variableInfo = this.variableStorage.getVariableByRef(variable)
      if (variableInfo === null) continue
      variables.push(variableInfo)
    }

    // set up initial data
    for (const variable of variables) {
      this.formulaObjectInfo.setValue([variable.ref], variable.value)
    }

    // set up connector
    for (const variable of variables) {
      this.variableConnectorStorage.connectVariableToObjectInfo(
        variable,
        this.formulaObjectInfo,
        [variable.ref]
      )
    }

    if (data.valueTypeChange) {
      if (
        info.valueType === 'NUMBER' &&
        typeof this.formulaObjectInfo.value === 'number'
      ) {
        this.value = new NumberValue(this.formulaObjectInfo.value)
        this.dispatcher.dispatch('VALUE_TYPE_CHANGED', info.valueType)
      } else if (
        info.valueType === 'VECTOR' &&
        Array.isArray(this.formulaObjectInfo.value)
      ) {
        this.value = new VectorValue(this.formulaObjectInfo.value)
        this.dispatcher.dispatch('VALUE_TYPE_CHANGED', info.valueType)
      } else {
        throw errorResponse(
          'FORMULA_OBJECT_VARIABLE_TYPE_MISMATCH',
          'Formula object info type and variable value type is mismatch'
        )
      }
    }
  }

  destroy() {
    console.log('DEBUG: destroy')

    this.formulaObjectInfo.eventDispatcher.removeListener(
      'FORMULA_VALUE_UPDATE',
      this.onFormulaValueUpdate
    )
    this.formulaObjectInfo.eventDispatcher.removeListener(
      'FORMULA_INFO_UPDATE',
      this.updateReferredVariables
    )
    this.variableConnectorStorage.deleteObjectConnectors(
      this.formulaObjectInfo.config.id
    )
    this.objectInfoManager.objectInfoStorage.delete(
      this.formulaObjectInfo.config.id
    )
    this.formulaObjectInfo.destroy()
    super.destroy()
  }

  serialize(): FormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formula: this.formulaObjectInfo.config.formula,
      value: this.value.get(),
      valueType: this.value.valueType,
    }
  }
}
