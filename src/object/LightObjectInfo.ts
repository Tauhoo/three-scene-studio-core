import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'

export const lightObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_LIGHT'),
  sceneId: z.number(),
  uuid: z.string(),
})

export type LightObjectReference = z.infer<typeof lightObjectReferenceSchema>

export class LightObjectInfo extends ObjectInfo<
  LightObjectReference,
  THREE.Light
> {
  constructor(data: THREE.Light, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_LIGHT',
        sceneId,
        uuid: data.uuid,
      },
      data
    )
  }
}

export class LightObjectInfoStorage extends DataStorage<
  LightObjectReference,
  LightObjectInfo
> {
  constructor() {
    super(reference => reference.uuid)
  }

  setNative(light: THREE.Light, sceneId: number) {
    const lightObjectInfo = new LightObjectInfo(light, sceneId)
    this.set(lightObjectInfo.reference, lightObjectInfo)
  }

  setMultipleNative(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    scenes.forEach(scene => {
      scene.traverse(child => {
        if (child instanceof THREE.Light) {
          this.setNative(child, scene.id)
        }
      })
    })
  }
}
