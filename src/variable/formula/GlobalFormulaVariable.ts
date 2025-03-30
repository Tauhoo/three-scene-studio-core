import * as z from 'zod'
import { NumberValue, VariableEventPacket, VectorValue } from '../Variable'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'
import { ReferrableVariable } from '../ReferrableVariable'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'
import { errorResponse, FormulaInfo, getVariableFromNode } from '../../utils'

export const globalFormulaVariableConfigSchema = z.object({
  type: z.literal('GLOBAL_FORMULA'),
  id: z.string(),
  formula: z.string(),
  valueType: z.union([z.literal('NUMBER'), z.literal('VECTOR')]),
  value: z.union([z.number(), z.array(z.number())]),
  name: z.string(),
  ref: z.string(),
})

export type GlobalFormulaVariableConfig = z.infer<
  typeof globalFormulaVariableConfigSchema
>

export type GlobalFormulaVariableEventPacket = EventPacket<
  'FORMULA_VARIABLE_UPDATE',
  { formulaInfo: FormulaInfo }
>
export class GlobalFormulaVariable extends ReferrableVariable {
  type: 'GLOBAL_FORMULA' = 'GLOBAL_FORMULA'
  group: 'USER_DEFINED' = 'USER_DEFINED'
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
    ref: string,
    formulaObjectInfo: FormulaObjectInfo,
    name: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    super(name, ref, id)
    if (typeof formulaObjectInfo.value === 'number') {
      this.value = new NumberValue(formulaObjectInfo.value)
    } else {
      this.value = new VectorValue(formulaObjectInfo.value)
    }
    this.objectInfoManager = objectInfoManager
    this.variableStorage = variableStorage
    this.variableConnectorStorage = variableConnectorStorage
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

  private onFormulaValueUpdate = ({ value }: { value: number }) => {
    if (typeof value === 'number' && this.value instanceof NumberValue) {
      this.value.set(value)
    } else if (Array.isArray(value) && this.value instanceof VectorValue) {
      this.value.set(value)
    }
  }

  allReferredVariables = () => {
    const connectors = this.variableConnectorStorage.getByObjectInfoId(
      this.formulaObjectInfo.config.id
    )
    if (connectors === null) return []
    const result: string[] = []
    for (const connector of connectors) {
      const variable = connector.getVariable()
      if (variable instanceof GlobalFormulaVariable) {
        result.push(...variable.allReferredVariables())
      }
    }
    return result
  }

  updateReferredVariables = (data: { valueTypeChange: boolean }) => {
    console.log('DEBUG: update referred variables', data.valueTypeChange)

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

  serialize(): GlobalFormulaVariableConfig {
    return {
      type: 'GLOBAL_FORMULA',
      name: this.name,
      ref: this.ref,
      id: this.id,
      formula: this.formulaObjectInfo.config.formula,
      value: this.value.get(),
      valueType: this.value.valueType,
    }
  }
}
