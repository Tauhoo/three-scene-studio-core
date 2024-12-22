import * as THREE from 'three'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'
import { ObjectInSceneInfo } from './ObjectInSceneInfo'
import { getChildren } from './children'

export const lightObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_LIGHT'),
  sceneId: z.number(),
  id: z.number(),
})

export type LightObjectReference = z.infer<typeof lightObjectReferenceSchema>

export class LightObjectInfo extends ObjectInSceneInfo<
  LightObjectReference,
  THREE.Light
> {
  constructor(data: THREE.Light, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_LIGHT',
        sceneId,
        id: data.id,
      },
      data,
      sceneId
    )
  }

  protected getChildren(
    data: THREE.Light,
    sceneId: number
  ): ObjectInSceneInfo[] {
    return getChildren(data, sceneId)
  }

  get name() {
    return this.data.name
  }
}

export class LightObjectInfoStorage extends DataStorage<
  LightObjectReference,
  LightObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
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
