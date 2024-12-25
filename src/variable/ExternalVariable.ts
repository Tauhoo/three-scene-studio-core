import EventDispatcher from '../utils/EventDispatcher'
import { ReferrableVariable } from './ReferrableVariable'
import { Variable, VariableEventPacket } from './Variable'
import * as z from 'zod'

export const externalVariableConfigSchema = z.object({
  type: z.literal('EXTERNAL'),
  id: z.string(),
  name: z.string(),
  value: z.number(),
  ref: z.string(),
})

export type ExternalVariableConfig = z.infer<
  typeof externalVariableConfigSchema
>

export class ExternalVariable extends ReferrableVariable<
  'EXTERNAL',
  'USER_DEFINED'
> {
  constructor(name: string, value: number, ref: string, id?: string) {
    super('EXTERNAL', name, value, ref, 'USER_DEFINED', id)
  }

  serialize(): ExternalVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
    }
  }
}
