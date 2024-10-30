import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

export interface MeshObjectReference {
  type: 'OBJECT_3D_MESH'
  sceneId: number
  id: number
}

class MeshObjectInfo extends ObjectInfo<MeshObjectReference, THREE.Mesh> {
  constructor(data: THREE.Mesh, scene: THREE.Group<THREE.Object3DEventMap>) {
    super(
      {
        type: 'OBJECT_3D_MESH',
        id: data.id,
        sceneId: scene.id,
      },
      data
    )
  }
}

export default MeshObjectInfo

export class MeshObjectInfoStorage extends DataStorage<
  MeshObjectReference,
  MeshObjectInfo
> {
  constructor(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    super(reference => reference.id.toString())
    scenes.forEach(scene => {
      scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          const meshObjectInfo = new MeshObjectInfo(child, scene)
          this.set(meshObjectInfo.reference, meshObjectInfo)
        }
      })
    })
  }
}
