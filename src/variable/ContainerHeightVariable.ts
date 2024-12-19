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

export class ContainerHeightVariable extends ReferrableVariable<'CONTAINER_HEIGHT'> {
  constructor(id: string, name: string, value: number, ref: string) {
    super('CONTAINER_HEIGHT', id, name, value, ref)
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
