import * as THREE from 'three'
import { GroupObjectInfo } from './GroupObjectInfo'
import { MeshObjectInfo } from './MeshObjectInfo'
import { LightObjectInfo } from './LightObjectInfo'
import { InSceneObjectInfo } from './InSceneObjectInfo'

export interface Parent {
  children: THREE.Object3D<THREE.Object3DEventMap>[]
}

export const getChildren = (
  data: Parent,
  sceneId: number
): InSceneObjectInfo[] => {
  return data.children
    .map(child => {
      if (child instanceof THREE.Mesh) {
        return new MeshObjectInfo(child, sceneId)
      }
      if (child instanceof THREE.Group) {
        return new GroupObjectInfo(child, sceneId)
      }
      if (child instanceof THREE.Light) {
        return new LightObjectInfo(child, sceneId)
      }
    })
    .filter(child => child !== undefined)
}
