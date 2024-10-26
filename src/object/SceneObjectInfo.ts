import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'

interface SceneObjectReference {
  type: 'OBJECT_3D_SCENE'
  id: number
}

class SceneObjectInfo extends ObjectInfo<
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

export default SceneObjectInfo
