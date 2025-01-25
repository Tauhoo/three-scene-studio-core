import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'

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
  readonly children: InSceneObjectInfo[]
  readonly animationMixer: THREE.AnimationMixer

  constructor(data: THREE.Scene, id?: string) {
    super()
    this.config = {
      type: 'OBJECT_3D_SCENE',
      id: id ?? uuidv4(),
      sceneId: data.id,
      inSceneId: data.id,
    }
    this.data = data
    this.children = getChildren(this.data, this.config.inSceneId)
    this.animationMixer = new THREE.AnimationMixer(this.data)
  }

  get name() {
    return this.data.name
  }

  set name(name: string) {
    this.data.name = name
  }
}

export function createSceneObjectInfoFromGroup(group: THREE.Group) {
  const scene = new THREE.Scene()
  scene.add(...group.children)

  scene.name = group.name
  return new SceneObjectInfo(scene)
}

export function createEmptySceneObjectInfo(name: string) {
  const scene = new THREE.Scene()
  scene.name = name
  return new SceneObjectInfo(scene)
}
