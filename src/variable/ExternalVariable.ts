import EventDispatcher from '../utils/EventDispatcher'
import { NodeValueInfo, NodeValueType } from '../utils'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from './ReferrableVariable'
import { NumberValue, VariableEventPacket, VectorValue } from './Variable'
import * as z from 'zod'

export const externalVariableConfigSchema = z.object({
  type: z.literal('EXTERNAL'),
  id: z.string(),
  name: z.string(),
  value: z.union([z.number(), z.array(z.number())]),
  ref: z.string(),
})

export type ExternalVariableConfig = z.infer<
  typeof externalVariableConfigSchema
>

export class ExternalVariable extends ReferrableVariable {
  type: 'EXTERNAL' = 'EXTERNAL'
  group: 'USER_DEFINED' = 'USER_DEFINED'
  dispatcher = new EventDispatcher<
    ReferrableVariableEventPacket | VariableEventPacket
  >()
  value: NumberValue | VectorValue
  constructor(name: string, value: NodeValueInfo, ref: string, id?: string) {
    super(name, ref, id)

    if (value.valueType === 'NUMBER') {
      this.value = new NumberValue(value.value)
    } else {
      this.value = new VectorValue(value.value)
    }
  }

  serialize(): ExternalVariableConfig {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value.get(),
      ref: this.ref,
    }
  }
}
