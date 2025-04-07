import * as z from 'zod'
import { VariableEventPacket } from '../Variable'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'
import { ReferrableVariable } from '../ReferrableVariable'
import { ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'
import { FormulaInfo, NodeValueType } from '../../utils'
import { FormulaManager } from './FormulaManager'

export const globalFormulaVariableConfigSchema = z.object({
  type: z.literal('GLOBAL_FORMULA'),
  id: z.string(),
  formula: z.string(),
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
  formulaManager: FormulaManager

  constructor(
    ref: string,
    name: string,
    formula: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    super(ref, name, id)
    this.formulaManager = new FormulaManager(
      formula,
      objectInfoManager,
      variableConnectorStorage,
      variableStorage,
      ref
    )
    this.formulaManager.dispatcher.addListener(
      'VALUE_TYPE_CHANGED',
      this.onValueTypeChange
    )
  }

  onValueTypeChange = (valueType: NodeValueType) => {
    this.dispatcher.dispatch('VALUE_TYPE_CHANGED', valueType)
  }

  get value() {
    return this.formulaManager.value
  }

  destroy() {
    this.formulaManager.dispatcher.removeListener(
      'VALUE_TYPE_CHANGED',
      this.onValueTypeChange
    )
    this.formulaManager.destroy()
    super.destroy()
  }

  serialize(): GlobalFormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formula: this.formulaManager.formula,
      value: this.formulaManager.value.get(),
      name: this.name,
      ref: this.ref,
    }
  }
}
