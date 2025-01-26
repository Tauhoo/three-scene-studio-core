import * as THREE from 'three'
import DataStorage from '../../utils/DataStorage'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class AnimationData {
  readonly data: THREE.AnimationClip
  private objectInfoStorage: ObjectInfoStorage
  private animationActionStorage: DataStorage<string, THREE.AnimationAction>
  // shared data
  private _time: number = 0
  private _weight: number = 1

  constructor(data: THREE.AnimationClip, objectInfoStorage: ObjectInfoStorage) {
    this.data = data
    this.objectInfoStorage = objectInfoStorage
    this.animationActionStorage = new DataStorage(value => value)
    this.setup()
  }

  private setup() {
    const sceneObjectInfos = this.objectInfoStorage.getSceneObjectInfos()
    for (const sceneObjectInfo of sceneObjectInfos) {
      const animationClip = sceneObjectInfo.animationMixer.clipAction(this.data)
      animationClip.enabled = true
      animationClip.play()
      this.animationActionStorage.set(sceneObjectInfo.config.id, animationClip)
    }
    this.progress = 0
  }

  set progress(time: number) {
    for (const animationAction of this.animationActionStorage.getAll()) {
      animationAction.time = time * this.duration
    }
    this._time = time
  }

  get progress() {
    return this._time
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

  getTargetObjectNames() {
    const nameSet = new Set(
      this.data.tracks
        .map(track => track.name.split('.')[0] ?? null)
        .filter(value => value !== null)
    )
    return [...nameSet]
  }
}
