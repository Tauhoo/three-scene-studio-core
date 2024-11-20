import * as THREE from 'three'
import { ObjectInfo, ObjectReference, ObjectType } from '.'
import { AnimationObjectInfoStorage } from './AnimationObjectInfo'
import { CameraObjectInfo, CameraObjectInfoStorage } from './CameraObjectInfo'
import { SceneObjectInfo, SceneObjectInfoStorage } from './SceneObjectInfo'
import EventDispatcher from '../utils/EventDispatcher'

type ObjectInfoManagerEvent = {
  type: 'OBJECT_INFO_ADDED'
  data: ObjectInfo
}

export class ObjectInfoManager extends EventDispatcher<ObjectInfoManagerEvent> {
  private animationObjectInfoStorage: AnimationObjectInfoStorage
  private cameraObjectInfoStorage: CameraObjectInfoStorage
  private sceneObjectInfoStorage: SceneObjectInfoStorage

  constructor() {
    super()
    this.animationObjectInfoStorage = new AnimationObjectInfoStorage()
    this.cameraObjectInfoStorage = new CameraObjectInfoStorage()
    this.sceneObjectInfoStorage = new SceneObjectInfoStorage()
  }

  getObjectInfoByReference<T extends ObjectReference>(
    reference: T
  ): Extract<ObjectInfo, { reference: T }> | null {
    if (reference.type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    }
    return null
  }

  getObjectInfos<T extends ObjectType>(
    type: T
  ): Extract<ObjectInfo, { reference: { type: T } }>[] {
    if (type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    }
    return []
  }

  createSceneObjectInfo(name: string) {
    const newScene = new THREE.Scene()
    newScene.name = name
    const info = new SceneObjectInfo(newScene)
    this.sceneObjectInfoStorage.set(info.reference, info)
    this.dispatch('OBJECT_INFO_ADDED', info)
    return info
  }

  addSceneObjectInfo(sceneInfo: SceneObjectInfo) {
    this.sceneObjectInfoStorage.set(sceneInfo.reference, sceneInfo)
    this.dispatch('OBJECT_INFO_ADDED', sceneInfo)
  }

  addCameraObjectInfo(cameraInfo: CameraObjectInfo) {
    this.cameraObjectInfoStorage.set(cameraInfo.reference, cameraInfo)
    this.dispatch('OBJECT_INFO_ADDED', cameraInfo)
  }
}
