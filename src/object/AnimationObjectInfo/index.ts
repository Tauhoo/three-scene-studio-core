import * as z from 'zod'
import * as THREE from 'three'
import { ObjectInfo, ObjectInfoEvent } from '../ObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { AnimationData } from './AnimationData'
import EventDispatcher from '../../utils/EventDispatcher'

export const animationObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_ANIMATION'),
  id: z.string(),
  uuid: z.string(),
})

export type AnimationObjectConfig = z.infer<typeof animationObjectConfigSchema>

export class AnimationObjectInfo extends ObjectInfo {
  readonly config: AnimationObjectConfig
  readonly data: AnimationData
  readonly eventDispatcher: EventDispatcher<ObjectInfoEvent>

  constructor(
    data: THREE.AnimationClip,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super()
    this.config = {
      type: 'OBJECT_3D_ANIMATION',
      id: id ?? uuidv4(),
      uuid: data.uuid,
    }
    this.data = new AnimationData(data, objectInfoStorage)
    this.eventDispatcher = new EventDispatcher()
  }
}
