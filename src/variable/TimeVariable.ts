import Context from '../utils/Context'
import EventDispatcher from '../utils/EventDispatcher'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from './ReferrableVariable'
import * as z from 'zod'
import { VariableEventPacket } from './Variable'
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
  enabled = true

  constructor(clock: Clock, name: string, ref: string, id?: string) {
    clock.addListener('TICK', event => {
      if (this.enabled) {
        this.value = Date.now()
      } else {
        this.value = 0
      }
    })
    super(name, 0, ref, id)
  }

  serialize(): TimeVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
    }
  }
}
