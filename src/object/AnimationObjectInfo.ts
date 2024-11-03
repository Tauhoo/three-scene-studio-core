import * as z from 'zod'
import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

export const animationObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_ANIMATION'),
  uuid: z.string(),
})

export type AnimationObjectReference = z.infer<
  typeof animationObjectReferenceSchema
>

export class AnimationObjectInfo extends ObjectInfo<
  AnimationObjectReference,
  THREE.AnimationClip
> {
  constructor(data: THREE.AnimationClip) {
    super(
      {
        type: 'OBJECT_3D_ANIMATION',
        uuid: data.uuid,
      },
      data
    )
  }
}

export class AnimationObjectInfoStorage extends DataStorage<
  AnimationObjectReference,
  AnimationObjectInfo
> {
  constructor() {
    super(reference => reference.uuid)
  }

  setNative(animation: THREE.AnimationClip) {
    const animationObjectInfo = new AnimationObjectInfo(animation)
    this.set(animationObjectInfo.reference, animationObjectInfo)
  }

  setMultipleNative(animations: THREE.AnimationClip[]) {
    animations.forEach(animation => {
      this.setNative(animation)
    })
  }
}
