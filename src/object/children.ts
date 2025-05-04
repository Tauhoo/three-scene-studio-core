import * as THREE from 'three'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { ObjectInfoStorage } from './ObjectInfoStorage'

export interface Parent {
  children: THREE.Object3D<THREE.Object3DEventMap>[]
}

export const getChildren = (
  data: Parent,
  sceneId: string,
  objectInfoStorage: ObjectInfoStorage
): InSceneObjectInfo[] => {
  return data.children
    .map(child => {
      const objectInfoId = child.userData[
        'THREE_SCENE_STUDIO.OBJECT_INFO_ID'
      ] as string | undefined
      if (objectInfoId) {
        const objectInfo = objectInfoStorage.get(objectInfoId)
        if (objectInfo instanceof InSceneObjectInfo) {
          return objectInfo
        }
      }

      if (child instanceof THREE.SkinnedMesh) {
        return objectInfoStorage.createSkinMeshObjectInfo(
          child,
          sceneId,
          Array.isArray(child.material)
            ? Array(child.material.length).fill(null)
            : null,
          objectInfoId
        )
      }

      if (child instanceof THREE.Mesh) {
        return objectInfoStorage.createMeshObjectInfo(
          child,
          sceneId,
          Array.isArray(child.material)
            ? Array(child.material.length).fill(null)
            : null,
          objectInfoId
        )
      }

      if (child instanceof THREE.Group) {
        return objectInfoStorage.createGroupObjectInfo(
          child,
          sceneId,
          objectInfoId
        )
      }

      if (child instanceof THREE.Bone) {
        return objectInfoStorage.createBoneObjectInfo(
          child,
          sceneId,
          objectInfoId
        )
      }

      if (child instanceof THREE.Light) {
        return objectInfoStorage.createLightObjectInfo(
          child,
          sceneId,
          objectInfoId
        )
      }

      if (child.type === 'Object3D') {
        return objectInfoStorage.createGroupObjectInfo(
          child,
          sceneId,
          objectInfoId
        )
      }
    })
    .filter(child => child !== undefined)
}
