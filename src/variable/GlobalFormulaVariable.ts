import * as z from 'zod'
import { VariableEventPacket } from './Variable'
import { FormulaInfo } from '../utils/expression'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { ReferrableVariable } from './ReferrableVariable'

export const globalFormulaVariableConfigSchema = z.object({
  type: z.literal('GLOBAL_FORMULA'),
  id: z.string(),
  formula: z.string(),
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
  dispatcher = new EventDispatcher<
    VariableEventPacket | GlobalFormulaVariableEventPacket
  >()
  private formulaInfo: FormulaInfo

  constructor(
    ref: string,
    formulaInfo: FormulaInfo,
    name: string,
    id?: string
  ) {
    super(name, 0, ref, id)
    this.formulaInfo = formulaInfo
  }

  updateFormula(formulaInfo: FormulaInfo) {
    this.formulaInfo = formulaInfo
    this.dispatcher.dispatch('FORMULA_VARIABLE_UPDATE', { formulaInfo })
  }

  getFormulaInfo() {
    return this.formulaInfo
  }

  serialize(): GlobalFormulaVariableConfig {
    return {
      type: 'GLOBAL_FORMULA',
      name: this.name,
      ref: this.ref,
      id: this.id,
      formula: this.formulaInfo.expression,
      value: 0,
    }
  }
}
