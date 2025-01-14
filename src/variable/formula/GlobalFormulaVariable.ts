import * as z from 'zod'
import { VariableEventPacket } from '../Variable'
import { FormulaInfo } from '../../utils/expression'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'
import { ReferrableVariable } from '../ReferrableVariable'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import VariableConnectorStorage from '../VariableConnectorStorage'

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

  getFormulaObjectInfo() {
    return this.formulaObjectInfo
  }

  constructor(
    ref: string,
    formulaObjectInfo: FormulaObjectInfo,
    name: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    id?: string
  ) {
    super(name, formulaObjectInfo.value, ref, id)
    this.objectInfoManager = objectInfoManager
    this.variableConnectorStorage = variableConnectorStorage
    this.formulaObjectInfo = formulaObjectInfo
    this.formulaObjectInfo.eventDispatcher.addListener(
      'FORMULA_VALUE_UPDATE',
      this.onFormulaValueUpdate
    )
  }

  private onFormulaValueUpdate = ({ value }: { value: number }) => {
    this.value = value
  }

  destroy() {
    this.formulaObjectInfo.eventDispatcher.removeListener(
      'FORMULA_VALUE_UPDATE',
      this.onFormulaValueUpdate
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
