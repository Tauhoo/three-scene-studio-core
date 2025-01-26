import * as THREE from 'three'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { ObjectInfoStorage } from './ObjectInfoStorage'

export interface Parent {
  children: THREE.Object3D<THREE.Object3DEventMap>[]
}

export const getChildren = (
  data: Parent,
  sceneId: number,
  objectInfoStorage: ObjectInfoStorage
): InSceneObjectInfo[] => {
  return data.children
    .map(child => {
      if (child instanceof THREE.SkinnedMesh) {
        return objectInfoStorage.createSkinMeshObjectInfo(child, sceneId)
      }

      if (child instanceof THREE.Mesh) {
        return objectInfoStorage.createMeshObjectInfo(child, sceneId)
      }

      if (child instanceof THREE.Group) {
        return objectInfoStorage.createGroupObjectInfo(child, sceneId)
      }

      if (child instanceof THREE.Bone) {
        return objectInfoStorage.createBoneObjectInfo(child, sceneId)
      }

      if (child instanceof THREE.Light) {
        return objectInfoStorage.createLightObjectInfo(child, sceneId)
      }

      if (child.type === 'Object3D') {
        return objectInfoStorage.createGroupObjectInfo(child, sceneId)
      }
    })
    .filter(child => child !== undefined)
}
