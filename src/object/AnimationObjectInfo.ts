import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'

interface AnimationObjectReference {
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
