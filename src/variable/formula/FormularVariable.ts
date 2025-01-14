import * as z from 'zod'
import { Variable, VariableEventPacket } from '../Variable'
import EventDispatcher from '../../utils/EventDispatcher'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import VariableConnectorStorage from '../VariableConnectorStorage'

export const formulaVariableConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  value: z.number(),
  formulaObjectInfoId: z.string(),
})

export type FormulaVariableConfig = z.infer<typeof formulaVariableConfigSchema>

export class FormulaVariable extends Variable {
  type: 'FORMULA' = 'FORMULA'
  group: 'PRIVATE' = 'PRIVATE'
  dispatcher = new EventDispatcher<VariableEventPacket>()
  private formulaObjectInfo: FormulaObjectInfo
  private objectInfoManager: ObjectInfoManager
  private variableConnectorStorage: VariableConnectorStorage
  getFormulaObjectInfo() {
    return this.formulaObjectInfo
  }

  constructor(
    formulaObjectInfo: FormulaObjectInfo,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    id?: string
  ) {
    super(formulaObjectInfo.value, id)
    this.variableConnectorStorage = variableConnectorStorage
    this.objectInfoManager = objectInfoManager
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

  serialize(): FormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formulaObjectInfoId: this.formulaObjectInfo.config.id,
      value: 0,
    }
  }
}
