import * as z from 'zod'
import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import { v4 as uuidv4 } from 'uuid'
export const animationObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_ANIMATION'),
  id: z.string(),
  uuid: z.string(),
})

export type AnimationObjectConfig = z.infer<typeof animationObjectConfigSchema>

export class AnimationObjectInfo extends ObjectInfo {
  readonly config: AnimationObjectConfig
  readonly data: THREE.AnimationClip

  constructor(data: THREE.AnimationClip, id?: string) {
    super()
    this.config = {
      type: 'OBJECT_3D_ANIMATION',
      id: id ?? uuidv4(),
      uuid: data.uuid,
    }
    this.data = data
  }
}
