import DataStorage from '../utils/DataStorage'
import { AnimationObjectInfo } from './AnimationObjectInfo'
import { CameraObjectInfo } from './camera'
import { ObjectInfo } from './ObjectInfo'
import { SceneObjectInfo } from './SceneObjectInfo'

export class ObjectInfoStorage extends DataStorage<string, ObjectInfo> {
  constructor() {
    super(value => value)
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
