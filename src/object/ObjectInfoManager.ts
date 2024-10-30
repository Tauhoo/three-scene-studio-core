import { GLTF } from '../loader'
import {
  AnimationObjectInfo,
  CameraObjectInfo,
  ObjectInfos,
  ObjectReference,
  ObjectType,
  SceneObjectInfo,
} from '.'
import * as THREE from 'three'
import { AnimationObjectInfoStorage } from './AnimationObjectInfo'
import { CameraObjectInfoStorage } from './CameraObjectInfo'
import { LightObjectInfoStorage } from './LightObjectInfo'
import { MeshObjectInfoStorage } from './MeshObjectInfo'
import { SceneObjectInfoStorage } from './SceneObjectInfo'

class ObjectInfoManager {
  private animationObjectInfoStorage: AnimationObjectInfoStorage
  private cameraObjectInfoStorage: CameraObjectInfoStorage
  private lightObjectInfoStorage: LightObjectInfoStorage
  private meshObjectInfoStorage: MeshObjectInfoStorage
  private sceneObjectInfoStorage: SceneObjectInfoStorage
  constructor(gltf: GLTF) {
    this.animationObjectInfoStorage = new AnimationObjectInfoStorage(
      gltf.animations
    )
    this.cameraObjectInfoStorage = new CameraObjectInfoStorage(gltf.cameras)
    this.lightObjectInfoStorage = new LightObjectInfoStorage(gltf.scenes)
    this.meshObjectInfoStorage = new MeshObjectInfoStorage(gltf.scenes)
    this.sceneObjectInfoStorage = new SceneObjectInfoStorage(gltf.scenes)
  }

  getObjectInfoByReference<T extends ObjectReference>(
    reference: T
  ): Extract<ObjectInfos, { reference: T }> | null {
    if (reference.type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.get(reference) as Extract<
        ObjectInfos,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.get(reference) as Extract<
        ObjectInfos,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.get(reference) as Extract<
        ObjectInfos,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_MESH') {
      return this.meshObjectInfoStorage.get(reference) as Extract<
        ObjectInfos,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_LIGHT') {
      return this.lightObjectInfoStorage.get(reference) as Extract<
        ObjectInfos,
        { reference: T }
      >
    }
    return null
  }

  getObjectInfos<T extends ObjectType>(
    type: T
  ): Extract<ObjectInfos, { reference: { type: T } }>[] {
    if (type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.getAll() as Extract<
        ObjectInfos,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.getAll() as Extract<
        ObjectInfos,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.getAll() as Extract<
        ObjectInfos,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_MESH') {
      return this.meshObjectInfoStorage.getAll() as Extract<
        ObjectInfos,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_LIGHT') {
      return this.lightObjectInfoStorage.getAll() as Extract<
        ObjectInfos,
        { reference: { type: T } }
      >[]
    }
    return []
  }
}

export default ObjectInfoManager
