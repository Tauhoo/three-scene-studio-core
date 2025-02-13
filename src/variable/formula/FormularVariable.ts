import * as z from 'zod'
import { Variable, VariableEventPacket } from '../Variable'
import EventDispatcher from '../../utils/EventDispatcher'
import { FormulaObjectInfo, ObjectInfoManager } from '../../object'
import VariableConnectorStorage from '../VariableConnectorStorage'
import { ReferrableVariable } from '../ReferrableVariable'
import VariableStorage from '../VariableStorage'

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
  private variableStorage: VariableStorage

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
    super(formulaObjectInfo.value, id)
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

  serialize(): FormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formulaObjectInfoId: this.formulaObjectInfo.config.id,
      value: 0,
    }
  }
}
