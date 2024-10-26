import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'

interface LightObjectReference {
  type: 'OBJECT_3D_LIGHT'
  uuid: string
}

class LightObjectInfo extends ObjectInfo<LightObjectReference, THREE.Light> {
  constructor(data: THREE.Light) {
    super(
      {
        type: 'OBJECT_3D_LIGHT',
        uuid: data.uuid,
      },
      data
    )
  }
}

export default LightObjectInfo
