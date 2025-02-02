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

  // scene object info change
  private onAddObjectInfo = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof SceneObjectInfo) {
      this.setupForSceneObjectInfo(objectInfo)
    }
  }

  private onDeleteObjectInfo = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof SceneObjectInfo) {
      this.destryForSceneObjectInfo(objectInfo)
    }
  }

  private onUpdateObjectInfo = (data: { from: ObjectInfo; to: ObjectInfo }) => {
    if (data.from instanceof SceneObjectInfo) {
      this.destryForSceneObjectInfo(data.from)
    }

    if (data.to instanceof SceneObjectInfo) {
      this.setupForSceneObjectInfo(data.to)
    }
  }

  private onNewObjectAddedInSceneObjectInfo = (data: {
    object: InSceneObjectInfo
    parent: InSceneObjectInfo
  }) => {
    if (!(data.parent instanceof SceneObjectInfo)) return
    const objectNames = new Set(
      this.data.tracks
        .map(value => value.name.split('.')[0])
        .filter(value => value !== undefined)
    )
    if (objectNames.has(data.object.data.name)) {
      this.destryForSceneObjectInfo(data.parent)
      this.setupForSceneObjectInfo(data.parent)
    }
  }

  private onChildMoveToNewScene = (data: {
    level: number
    object: InSceneObjectInfo
    to: SceneObjectInfo
  }) => {
    const objectNames = new Set(
      this.data.tracks
        .map(value => value.name.split('.')[0])
        .filter(value => value !== undefined)
    )
    if (objectNames.has(data.object.data.name)) {
      this.destryForSceneObjectInfo(data.to)
      this.setupForSceneObjectInfo(data.to)
    }
  }

  private onChildDestroy = (data: {
    level: number
    object: InSceneObjectInfo
    parent: InSceneObjectInfo
  }) => {
    if (!(data.parent instanceof SceneObjectInfo)) return
    const objectNames = new Set(
      this.data.tracks
        .map(value => value.name.split('.')[0])
        .filter(value => value !== undefined)
    )
    if (objectNames.has(data.object.data.name)) {
      this.destryForSceneObjectInfo(data.parent)
      this.setupForSceneObjectInfo(data.parent)
    }
  }

  private onChildNameChange = (data: {
    level: number
    from: string
    to: string
    parent: InSceneObjectInfo
  }) => {
    if (!(data.parent instanceof SceneObjectInfo)) return
    const objectNames = new Set(
      this.data.tracks
        .map(value => value.name.split('.')[0])
        .filter(value => value !== undefined)
    )
    if (objectNames.has(data.from) || objectNames.has(data.to)) {
      this.destryForSceneObjectInfo(data.parent)
      this.setupForSceneObjectInfo(data.parent)
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
    sceneObjectInfo.eventDispatcher.removeListener(
      'NEW_OBJECT_ADDED',
      this.onNewObjectAddedInSceneObjectInfo
    )
    sceneObjectInfo.eventDispatcher.removeListener(
      'CHILD_MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    sceneObjectInfo.eventDispatcher.removeListener(
      'CHILD_NAME_CHANGE',
      this.onChildNameChange
    )
    sceneObjectInfo.eventDispatcher.removeListener(
      'CHILD_DESTROY',
      this.onChildDestroy
    )
  }

  private setupForSceneObjectInfo = (sceneObjectInfo: SceneObjectInfo) => {
    // find object and create track with id to supportobject name duplicating
    const objectNames = [
      ...new Set(
        this.data.tracks
          .map(value => value.name.split('.')[0])
          .filter(value => value !== undefined)
      ),
    ]
    const objectMap: Record<string, InSceneObjectInfo[]> = {}

    for (const objectName of objectNames) {
      const children = sceneObjectInfo.findChildrenByName(objectName)
      if (children.length === 0) continue
      if (objectMap[objectName] === undefined) {
        objectMap[objectName] = []
      }
      objectMap[objectName].push(...children)
    }

    const newAnimationClip = this.data.clone()
    newAnimationClip.tracks = []

    for (const track of this.data.tracks) {
      const objectName = track.name.split('.')[0]
      if (objectName === undefined) continue
      const objects = objectMap[objectName]
      if (objects === undefined) continue
      for (const object of objects) {
        const newTrack = track.clone()
        newTrack.name = newTrack.name.replace(objectName, object.data.uuid)
        newAnimationClip.tracks.push(newTrack)
      }
    }

    // create animation action
    const animationAction =
      sceneObjectInfo.animationMixer.clipAction(newAnimationClip)
    animationAction.enabled = true
    animationAction.play()
    this.animationActionStorage.set(sceneObjectInfo.config.id, animationAction)
    animationAction.time = this.progress * this.duration
    sceneObjectInfo.eventDispatcher.addListener(
      'NEW_OBJECT_ADDED',
      this.onNewObjectAddedInSceneObjectInfo
    )
    sceneObjectInfo.eventDispatcher.addListener(
      'CHILD_MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    sceneObjectInfo.eventDispatcher.addListener(
      'CHILD_NAME_CHANGE',
      this.onChildNameChange
    )
    sceneObjectInfo.eventDispatcher.addListener(
      'CHILD_DESTROY',
      this.onChildDestroy
    )
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
