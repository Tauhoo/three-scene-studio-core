import * as z from 'zod'
import { Variable, VariableEventPacket } from './Variable'
import { FormulaInfo } from '../utils/expression'
import { EventPacket } from '../utils/EventDispatcher'

export const formulaVariableConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.number(),
})

export type FormulaVariableConfig = z.infer<typeof formulaVariableConfigSchema>

export type FormulaVariableEventPacket = EventPacket<
  'FORMULA_VARIABLE_UPDATE',
  { formulaInfo: FormulaInfo }
>

export class FormulaVariable extends Variable<
  'FORMULA',
  'SYSTEM',
  VariableEventPacket | FormulaVariableEventPacket
> {
  private formulaInfo: FormulaInfo

  constructor(formulaInfo: FormulaInfo, id?: string) {
    super('FORMULA', 0, 'SYSTEM', id)
    this.formulaInfo = formulaInfo
  }

  updateFormula(formulaInfo: FormulaInfo) {
    this.formulaInfo = formulaInfo
    this.dispatcher.dispatch('FORMULA_VARIABLE_UPDATE', { formulaInfo })
  }

  getFormulaInfo() {
    return this.formulaInfo
  }

  serialize(): FormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formula: this.formulaInfo.expression,
      value: 0,
    }
  }
}
