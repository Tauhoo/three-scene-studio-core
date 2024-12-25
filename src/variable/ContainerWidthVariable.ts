import EventDispatcher from '../utils/EventDispatcher'
import { ReferrableVariable } from './ReferrableVariable'
import { Variable, VariableEventPacket } from './Variable'
import * as z from 'zod'

export const containerWidthVariableConfigSchema = z.object({
  type: z.literal('CONTAINER_WIDTH'),
  id: z.string(),
  name: z.string(),
  value: z.number(),
  ref: z.string(),
})

export type ContainerWidthVariableConfig = z.infer<
  typeof containerWidthVariableConfigSchema
>

export class ContainerWidthVariable extends ReferrableVariable<
  'CONTAINER_WIDTH',
  'SYSTEM'
> {
  constructor(name: string, value: number, ref: string, id?: string) {
    super('CONTAINER_WIDTH', name, value, ref, 'SYSTEM', id)
  }

  serialize(): ContainerWidthVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
    }
  }
}
