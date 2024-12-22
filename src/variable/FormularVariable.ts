import * as z from 'zod'
import { Variable } from './Variable'
import { ExpressionBlock, FormulaInfo } from '../utils/expression'

export const formulaVariableConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.number(),
})

export type FormulaVariableConfig = z.infer<typeof formulaVariableConfigSchema>

export class FormulaVariable extends Variable<'FORMULA'> {
  private formulaInfo: FormulaInfo

  constructor(formulaInfo: FormulaInfo, id?: string) {
    super('FORMULA', 0, id)
    this.formulaInfo = formulaInfo
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
