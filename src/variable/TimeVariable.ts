import EventDispatcher from '../utils/EventDispatcher'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from './ReferrableVariable'
import * as z from 'zod'
import { NumberValue, VariableEventPacket } from './Variable'
import { Clock } from '../Clock'

export const timeVariableConfigSchema = z.object({
  type: z.literal('TIME'),
  id: z.string(),
  name: z.string(),
  value: z.number(),
  ref: z.string(),
})

export type TimeVariableConfig = z.infer<typeof timeVariableConfigSchema>

export class TimeVariable extends ReferrableVariable {
  type: 'TIME' = 'TIME'
  group: 'SYSTEM' = 'SYSTEM'
  dispatcher = new EventDispatcher<
    ReferrableVariableEventPacket | VariableEventPacket
  >()
  private _enabled = true
  value: NumberValue = new NumberValue(0)

  constructor(private clock: Clock, name: string, ref: string, id?: string) {
    super(name, ref, id)
    clock.addListener('TICK', this.onTick)
  }

  private onTick = () => {
    if (this.enabled) {
      this.value.set(Date.now())
    }
  }

  get enabled() {
    return this._enabled
  }

  set enabled(value: boolean) {
    this._enabled = value
    if (!value) {
      this.value.set(0)
    }
  }

  serialize(): TimeVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value.get(),
      ref: this.ref,
    }
  }

  destroy(): void {
    this.clock.removeListener('TICK', this.onTick)
  }
}
