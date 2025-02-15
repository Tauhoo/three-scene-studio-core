import { FormulaInfo } from '../utils/expression'
import { ObjectInfo, ObjectInfoEvent, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

export const formulaObjectConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.number(),
})

export type FormulaObjectConfig = z.infer<typeof formulaObjectConfigSchema>

export type FormulaObjectEventPacket =
  | EventPacket<'FORMULA_VALUE_UPDATE', { value: any }>
  | EventPacket<'FORMULA_INFO_UPDATE', { formulaInfo: FormulaInfo }>
  | ObjectInfoEvent

export class FormulaObjectInfo extends ObjectInfo {
  readonly config: FormulaObjectConfig
  readonly data: Record<string, number> = {}
  private formulaInfo: FormulaInfo
  readonly eventDispatcher: EventDispatcher<FormulaObjectEventPacket>
  value: number = 0

  constructor(formulaInfo: FormulaInfo, id?: string) {
    super()
    this.eventDispatcher = new EventDispatcher()
    this.config = {
      type: 'FORMULA',
      id: id ?? uuidv4(),
      formula: formulaInfo.expression,
      value: 0,
    }
    this.formulaInfo = formulaInfo
    this.updateFormula(formulaInfo)
  }

  updateFormula(formulaInfo: FormulaInfo) {
    this.config.formula = formulaInfo.expression

    // update formula
    this.formulaInfo = formulaInfo

    // clear data
    for (const [key, value] of Object.entries(this.data)) {
      delete this.data[key]
    }
    this.eventDispatcher.dispatch('FORMULA_INFO_UPDATE', { formulaInfo })
  }

  getFormulaInfo() {
    return this.formulaInfo
  }

  calculateValue() {
    try {
      const newValue = this.formulaInfo.node.evaluate({
        ...this.data,
      })
      this.value = newValue
      this.eventDispatcher.dispatch('FORMULA_VALUE_UPDATE', { value: newValue })
    } catch (error) {
      console.error(error)
      this.value = 0
      this.eventDispatcher.dispatch('FORMULA_VALUE_UPDATE', { value: 0 })
    }
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    this.calculateValue()
    return result
  }
}
