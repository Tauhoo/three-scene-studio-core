import * as z from 'zod'
import { VariableEventPacket } from '../Variable'
import { FormulaInfo } from '../../utils/expression'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'
import { ReferrableVariable } from '../ReferrableVariable'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'

export const globalFormulaVariableConfigSchema = z.object({
  type: z.literal('GLOBAL_FORMULA'),
  id: z.string(),
  formulaObjectInfoId: z.string(),
  value: z.number(),
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
    super(name, formulaObjectInfo.value, ref, id)
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
    this.updateReferredVariables()
  }

  private onFormulaValueUpdate = ({ value }: { value: number }) => {
    this.value = value
  }

  updateReferredVariables() {
    const variableRefs = this.formulaObjectInfo.getFormulaInfo().variables

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
      formulaObjectInfoId: this.formulaObjectInfo.config.id,
      value: 0,
    }
  }
}
