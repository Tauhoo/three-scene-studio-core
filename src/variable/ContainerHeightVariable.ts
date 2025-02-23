import Context from '../utils/Context'
import EventDispatcher from '../utils/EventDispatcher'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from './ReferrableVariable'
import * as z from 'zod'
import { VariableEventPacket } from './Variable'

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

export class ContainerHeightVariable extends ReferrableVariable {
  type: 'CONTAINER_HEIGHT' = 'CONTAINER_HEIGHT'
  group: 'SYSTEM' = 'SYSTEM'
  dispatcher = new EventDispatcher<
    ReferrableVariableEventPacket | VariableEventPacket
  >()

  constructor(
    private context: Context,
    name: string,
    ref: string,
    id?: string
  ) {
    const rect = context.canvasContainer.getBoundingClientRect()
    super(name, rect.height, ref, id)
    context.addListener('CANVAS_RESIZE', this.onCanvasResize)
  }

  private onCanvasResize = (event: { height: number }) => {
    this.value = event.height
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

  destroy() {
    this.context.removeListener('CANVAS_RESIZE', this.onCanvasResize)
    super.destroy()
  }
}
