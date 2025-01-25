import * as THREE from 'three'
import DataStorage from '../utils/DataStorage'
import { AnimationObjectInfo } from './AnimationObjectInfo'
import { CameraObjectInfo, createCameraObjectFromNative } from './camera'
import { ObjectInfo } from './ObjectInfo'
import {
  createSceneObjectInfoFromGroup,
  SceneObjectInfo,
} from './SceneObjectInfo'

export class ObjectInfoStorage extends DataStorage<string, ObjectInfo> {
  constructor() {
    super(value => value)
  }

  createSceneObjectInfo(group: THREE.Group) {
    const result = createSceneObjectInfoFromGroup(group)
    this.set(result.config.id, result)
    return result
  }

  createCameraObjectInfo(camera: THREE.Camera) {
    const result = createCameraObjectFromNative(camera)
    this.set(result.config.id, result)
    return result
  }

  createAnimationObjectInfo(animation: THREE.AnimationClip) {
    const result = new AnimationObjectInfo(animation)
    this.set(result.config.id, result)
    return result
  }

  setObjectInfo(objectInfo: ObjectInfo) {
    this.set(objectInfo.config.id, objectInfo)
  }

  getCameraObjectInfos() {
    return this.getAll().filter(value => value instanceof CameraObjectInfo)
  }

  getSceneObjectInfos() {
    return this.getAll().filter(value => value instanceof SceneObjectInfo)
  }

  getAnimationObjectInfos() {
    return this.getAll().filter(value => value instanceof AnimationObjectInfo)
  }

  getSceneBySceneId(sceneId: number) {
    return this.getAll().find(
      value =>
        value instanceof SceneObjectInfo && value.config.sceneId === sceneId
    )
  }
}
