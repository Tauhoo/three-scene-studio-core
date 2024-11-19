import * as THREE from 'three'
import { MeshObjectInfo } from './MeshObjectInfo'
import { GroupObjectInfo } from './GroupObjectInfo'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInSceneInfo } from '.'

interface Parent {
  children: THREE.Object3D<THREE.Object3DEventMap>[]
}

export const getChildren = (
  data: Parent,
  sceneId: number
): ObjectInSceneInfo[] => {
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
