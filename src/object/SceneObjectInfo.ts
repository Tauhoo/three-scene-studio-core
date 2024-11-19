import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'
import { getChildren } from './children'
import { ObjectInSceneInfo } from '.'

export const sceneObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_SCENE'),
  id: z.number(),
})

export type SceneObjectReference = z.infer<typeof sceneObjectReferenceSchema>

export class SceneObjectInfo extends ObjectInfo<
  SceneObjectReference,
  THREE.Scene
> {
  static fromGroup(group: THREE.Group) {
    const scene = new THREE.Scene()
    group.children.forEach(child => {
      scene.add(child)
    })
    scene.name = group.name === '' ? 'No name' : group.name
    return new SceneObjectInfo(scene)
  }

  readonly children: ObjectInSceneInfo[] = []
  constructor(data: THREE.Scene) {
    super(
      {
        type: 'OBJECT_3D_SCENE',
        id: data.id,
      },
      data
    )
    this.children = getChildren(data, data.id)
  }

  addObjectInSceneInfo(objectInfo: ObjectInSceneInfo) {
    this.children.push(objectInfo)
    this.data.add(objectInfo.data)
  }

  get name() {
    return this.data.name
  }
}

export class SceneObjectInfoStorage extends DataStorage<
  SceneObjectReference,
  SceneObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
  }

  setNative(scene: THREE.Scene) {
    const sceneObjectInfo = new SceneObjectInfo(scene)
    this.set(sceneObjectInfo.reference, sceneObjectInfo)
  }

  setMultipleNative(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    scenes.forEach(scene => {
      const newScene = new THREE.Scene()
      scene.children.forEach(child => {
        newScene.add(child)
      })
      this.setNative(newScene)
    })
  }
}
