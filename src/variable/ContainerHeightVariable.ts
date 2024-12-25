import Context from '../utils/Context'
import { ReferrableVariable } from './ReferrableVariable'
import * as z from 'zod'

export const containerHeightVariableConfigSchema = z.object({
  type: z.literal('CONTAINER_HEIGHT'),
  id: z.string(),
  name: z.string(),
  value: z.number(),
  ref: z.string(),
})

export type ContainerHeightVariableConfig = z.infer<
  typeof containerHeightVariableConfigSchema
>

export class ContainerHeightVariable extends ReferrableVariable<
  'CONTAINER_HEIGHT',
  'SYSTEM'
> {
  constructor(context: Context, name: string, ref: string, id?: string) {
    const rect = context.canvasContainer.getBoundingClientRect()
    context.addListener('CANVAS_RESIZE', event => {
      this.value = event.height
    })
    super('CONTAINER_HEIGHT', name, rect.height, ref, 'SYSTEM', id)
  }

  serialize(): ContainerHeightVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
    }
  }
}
