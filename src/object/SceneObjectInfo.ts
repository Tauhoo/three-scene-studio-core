import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'

export const sceneObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_SCENE'),
  id: z.number(),
})

export type SceneObjectReference = z.infer<typeof sceneObjectReferenceSchema>

export class SceneObjectInfo extends ObjectInfo<
  SceneObjectReference,
  THREE.Group<THREE.Object3DEventMap>
> {
  constructor(data: THREE.Group<THREE.Object3DEventMap>) {
    super(
      {
        type: 'OBJECT_3D_SCENE',
        id: data.id,
      },
      data
    )
  }
}

export class SceneObjectInfoStorage extends DataStorage<
  SceneObjectReference,
  SceneObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
  }

  setNative(scene: THREE.Group<THREE.Object3DEventMap>) {
    const sceneObjectInfo = new SceneObjectInfo(scene)
    this.set(sceneObjectInfo.reference, sceneObjectInfo)
  }

  setMultipleNative(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    scenes.forEach(scene => {
      this.setNative(scene)
    })
  }
}
