import Context from '../utils/Context'
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
  constructor(context: Context, name: string, ref: string, id?: string) {
    const rect = context.canvasContainer.getBoundingClientRect()
    context.addListener('CANVAS_RESIZE', event => {
      this.value = event.width
    })
    super('CONTAINER_WIDTH', name, rect.width, ref, 'SYSTEM', id)
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
