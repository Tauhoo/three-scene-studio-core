import { ObjectInfo, ObjectInfoEvent, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { calculate, FormulaNode } from '../utils'
import { Clock } from '../Clock'

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

  needUpdate = true
  private formulaNode: FormulaNode
  value: number | number[] = 0

  constructor(
    private clock: Clock,
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

    this.clock.addListener('TICK', this.onTick)
  }

  onTick = () => {
    if (this.needUpdate) {
      this.calculateValue()
      this.needUpdate = false
    }
  }

  updateFormula(formulaNode: FormulaNode, initValue: number | number[]) {
    for (const [key, value] of Object.entries(this.data)) {
      delete this.data[key]
    }

    this.formulaNode = formulaNode
    this.value = initValue
    this.needUpdate = true
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
    if (objectPath.join('.') === 'test') {
      console.log('DEBUG: setValue test', value, isVector)
    }
    const result = super.setValue(objectPath, value, isVector)
    if (result.status === 'SUCCESS') {
      this.needUpdate = result.data
    }
    return result
  }

  destroy(): void {
    this.clock.removeListener('TICK', this.onTick)
    super.destroy()
  }
}
