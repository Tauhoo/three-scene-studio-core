import { ObjectInfo, ObjectInfoEvent, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { calculate, cleanCalculateResult, FormulaNode } from '../utils'
import { Clock } from '../Clock'
import { SystemValueType } from '../utils'
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
    this.value = initValue
    this.needUpdate = true

    this.clock.addListener('TICK', this.onTick)
  }

  onTick = () => {
    if (this.needUpdate) {
      this.calculateValue()
      this.needUpdate = false
    }
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

    this.value = cleanCalculateResult(result.data)
    this.eventDispatcher.dispatch('FORMULA_VALUE_UPDATE', { value: this.value })
  }

  setValue(objectPath: ObjectPath, value: any, valueType?: SystemValueType) {
    const result = super.setValue(objectPath, value, valueType)
    if (result.status === 'SUCCESS') {
      this.needUpdate = result.data
    } else {
      console.error(
        'fail set value to' + objectPath.join('.') + ' value ' + result
      )
    }
    return result
  }

  destroy(): void {
    this.clock.removeListener('TICK', this.onTick)
    super.destroy()
  }
}
