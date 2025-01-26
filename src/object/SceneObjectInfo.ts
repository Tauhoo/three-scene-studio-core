import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'

export const sceneObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_SCENE'),
  id: z.string(),
  inSceneId: z.number(),
  sceneId: z.number(),
})

export type SceneObjectConfig = z.infer<typeof sceneObjectConfigSchema>

export class SceneObjectInfo extends InSceneObjectInfo {
  readonly config: SceneObjectConfig
  readonly data: THREE.Scene
  readonly animationMixer: THREE.AnimationMixer
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.Scene,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, data.id, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_SCENE',
      id: id ?? uuidv4(),
      sceneId: data.id,
      inSceneId: data.id,
    }
    this.data = data
    this.animationMixer = new THREE.AnimationMixer(this.data)
    this.eventDispatcher = new EventDispatcher()
  }

  get name() {
    return this.data.name
  }

  set name(name: string) {
    this.data.name = name
  }
}
