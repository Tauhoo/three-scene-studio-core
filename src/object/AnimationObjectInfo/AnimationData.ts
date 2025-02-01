import * as THREE from 'three'
import DataStorage from '../../utils/DataStorage'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { InSceneObjectInfo } from '../InSceneObjectInfo'
import { SceneObjectInfo } from '../SceneObjectInfo'
import { ObjectInfo } from '../ObjectInfo'

export class AnimationData {
  readonly data: THREE.AnimationClip
  private objectInfoStorage: ObjectInfoStorage
  private animationActionStorage: DataStorage<string, THREE.AnimationAction>
  // shared data
  private _progress: number = 0
  private _weight: number = 1

  constructor(data: THREE.AnimationClip, objectInfoStorage: ObjectInfoStorage) {
    this.data = data
    this.objectInfoStorage = objectInfoStorage
    this.animationActionStorage = new DataStorage(value => value)
    this.setup()
    this.objectInfoStorage.addListener('ADD', this.onAddObjectInfo)
    this.objectInfoStorage.addListener('DELETE', this.onDeleteObjectInfo)
    this.objectInfoStorage.addListener('UPDATE', this.onUpdateObjectInfo)
  }
  onAddObjectInfo = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof SceneObjectInfo) {
      this.setupForSceneObjectInfo(objectInfo)
    }
  }

  onDeleteObjectInfo = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof SceneObjectInfo) {
      this.destryForSceneObjectInfo(objectInfo)
    }
  }

  onUpdateObjectInfo = (data: { from: ObjectInfo; to: ObjectInfo }) => {
    if (data.from instanceof SceneObjectInfo) {
      this.destryForSceneObjectInfo(data.from)
    }

    if (data.to instanceof SceneObjectInfo) {
      this.setupForSceneObjectInfo(data.to)
    }
  }

  private destryForSceneObjectInfo = (sceneObjectInfo: SceneObjectInfo) => {
    const animationAction = this.animationActionStorage.delete(
      sceneObjectInfo.config.id
    )
    if (animationAction) {
      animationAction.stop()
      animationAction.enabled = false
    }
  }

  private setupForSceneObjectInfo = (sceneObjectInfo: SceneObjectInfo) => {
    const animationAction = sceneObjectInfo.animationMixer.clipAction(this.data)
    animationAction.enabled = true
    animationAction.play()
    this.animationActionStorage.set(sceneObjectInfo.config.id, animationAction)
    animationAction.time = this.progress * this.duration
  }

  private setup = () => {
    const sceneObjectInfos = this.objectInfoStorage.getSceneObjectInfos()
    for (const sceneObjectInfo of sceneObjectInfos) {
      this.setupForSceneObjectInfo(sceneObjectInfo)
    }
  }

  set progress(value: number) {
    for (const animationAction of this.animationActionStorage.getAll()) {
      animationAction.time = value * this.duration
    }
    this._progress = value
  }

  get progress() {
    return this._progress
  }

  get duration() {
    return this.data.duration
  }

  set weight(weight: number) {
    for (const animationAction of this.animationActionStorage.getAll()) {
      animationAction.weight = weight
    }
    this._weight = weight
  }

  get weight() {
    return this._weight
  }

  get name() {
    return this.data.name
  }

  set name(value: string) {
    this.data.name = value
  }

  getTargetObjectNames = () => {
    const nameSet = new Set(
      this.data.tracks
        .map(track => track.name.split('.')[0] ?? null)
        .filter(value => value !== null)
    )
    return [...nameSet]
  }
}
