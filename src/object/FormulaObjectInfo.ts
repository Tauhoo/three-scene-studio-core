import { ObjectInfo, ObjectInfoEvent, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { calculate, FormulaInfo, FormulaNode, NodeValueType } from '../utils'

export const formulaObjectConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
})

export type FormulaObjectConfig = z.infer<typeof formulaObjectConfigSchema>

export type FormulaObjectEventPacket =
  | EventPacket<'FORMULA_VALUE_UPDATE', { value: any }>
  | ObjectInfoEvent

export class FormulaObjectInfo extends ObjectInfo {
  readonly config: FormulaObjectConfig
  readonly data: Record<string, number> = {}
  readonly eventDispatcher: EventDispatcher<FormulaObjectEventPacket>

  private formulaNode: FormulaNode
  value: number | number[] = 0

  constructor(
    formulaNode: FormulaNode,
    initValue: number | number[],
    id?: string
  ) {
    super()
    this.eventDispatcher = new EventDispatcher()
    this.config = {
      type: 'FORMULA',
      id: id ?? uuidv4(),
    }
    this.formulaNode = formulaNode
    this.updateFormula(formulaNode, initValue)
  }

  updateFormula(formulaNode: FormulaNode, initValue: number | number[]) {
    for (const [key, value] of Object.entries(this.data)) {
      delete this.data[key]
    }

    this.formulaNode = formulaNode
    this.value = initValue
  }

  getFormulaNode() {
    return this.formulaNode
  }

  calculateValue() {
    const result = calculate(this.formulaNode, this.data)
    if (result.status === 'ERROR') {
      console.error(result.error)
      return
    }
    this.value = result.data
    this.eventDispatcher.dispatch('FORMULA_VALUE_UPDATE', { value: this.value })
  }

  setValue(objectPath: ObjectPath, value: any, isVector?: boolean) {
    const result = super.setValue(objectPath, value, isVector)
    this.calculateValue()
    return result
  }
}
