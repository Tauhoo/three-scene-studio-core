import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'

export const boneObjectConfigSchema = z.object({
  type: z.literal('BONE'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type BoneObjectConfig = z.infer<typeof boneObjectConfigSchema>

export class BoneObjectInfo extends InSceneObjectInfo {
  readonly config: BoneObjectConfig
  readonly data: THREE.Bone
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.Bone,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage)
    this.config = {
      type: 'BONE',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }

  get name() {
    return this.data.name
  }
}
