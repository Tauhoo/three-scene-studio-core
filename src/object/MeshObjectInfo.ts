import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'

interface MeshObjectReference {
  type: 'OBJECT_3D_MESH'
  id: number
}

class MeshObjectInfo extends ObjectInfo<MeshObjectReference, THREE.Mesh> {
  constructor(data: THREE.Mesh) {
    super(
      {
        type: 'OBJECT_3D_MESH',
        id: data.id,
      },
      data
    )
  }
}

export default MeshObjectInfo
