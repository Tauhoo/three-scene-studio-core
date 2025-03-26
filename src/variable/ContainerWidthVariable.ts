import Context from '../utils/Context'
import EventDispatcher from '../utils/EventDispatcher'
import { NodeValueType, NumberValueInfo } from '../utils'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from './ReferrableVariable'
import { NumberValue, VariableEventPacket } from './Variable'
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

export class ContainerWidthVariable extends ReferrableVariable {
  type: 'CONTAINER_WIDTH' = 'CONTAINER_WIDTH'
  group: 'SYSTEM' = 'SYSTEM'
  dispatcher = new EventDispatcher<
    ReferrableVariableEventPacket | VariableEventPacket
  >()

  value: NumberValue

  constructor(
    private context: Context,
    name: string,
    ref: string,
    id?: string
  ) {
    const rect = context.canvasContainer.getBoundingClientRect()
    super(name, ref, id)
    this.value = new NumberValue(rect.width)
    context.addListener('CANVAS_RESIZE', this.onCanvasResize)
  }

  private onCanvasResize = (event: { width: number }) => {
    this.value.set(event.width)
  }

  destroy() {
    this.context.removeListener('CANVAS_RESIZE', this.onCanvasResize)
    super.destroy()
  }

  serialize(): ContainerWidthVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value.get(),
      ref: this.ref,
    }
  }
}
