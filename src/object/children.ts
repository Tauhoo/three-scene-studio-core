import * as THREE from 'three'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import { ObjectConfig } from './ObjectInfo'

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
      const objectConfig = child.userData[
        'THREE_SCENE_STUDIO.OBJECT_CONFIG'
      ] as ObjectConfig | undefined

      if (objectConfig) {
        const objectInfo = objectInfoStorage.get(objectConfig.id)
        if (objectInfo instanceof InSceneObjectInfo) {
          return objectInfo
        }
      }

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
