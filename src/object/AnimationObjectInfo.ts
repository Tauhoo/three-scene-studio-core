import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

export interface AnimationObjectReference {
  type: 'OBJECT_3D_ANIMATION'
  uuid: string
}

class AnimationObjectInfo extends ObjectInfo<
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

export default AnimationObjectInfo

export class AnimationObjectInfoStorage extends DataStorage<
  AnimationObjectReference,
  AnimationObjectInfo
> {
  constructor(animations: THREE.AnimationClip[]) {
    super(reference => reference.uuid)
    animations.forEach(animation => {
      const animationObjectInfo = new AnimationObjectInfo(animation)
      this.set(animationObjectInfo.reference, animationObjectInfo)
    })
  }
}
