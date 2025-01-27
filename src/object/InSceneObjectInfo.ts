import { ObjectConfig, ObjectInfo, ObjectInfoEvent } from './ObjectInfo'
import * as THREE from 'three'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import { getChildren } from './children'
import { SceneObjectInfo } from './SceneObjectInfo'
import { EventPacket } from '../utils'
import EventDispatcher from '../utils/EventDispatcher'

export type InSceneIdentifier = {
  sceneId: number
  inSceneId: number
}

export type ObjectInSceneInfoConfig = ObjectConfig & InSceneIdentifier

export type InSceneObjectInfoEvent =
  | EventPacket<'DESTROY', InSceneObjectInfo>
  | EventPacket<'MOVE_TO_NEW_SCENE', InSceneObjectInfo>
  | ObjectInfoEvent

export abstract class InSceneObjectInfo extends ObjectInfo {
  abstract readonly config: ObjectInSceneInfoConfig
  abstract readonly data: THREE.Object3D
  children: InSceneObjectInfo[]
  private objectInfoStorage: ObjectInfoStorage
  abstract readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.Object3D,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super()
    this.objectInfoStorage = objectInfoStorage
    this.children = getChildren(data, sceneId, objectInfoStorage)
    for (const child of this.children) {
      child.eventDispatcher.addListener('DESTROY', this.onChildrenDestroyed)
      child.eventDispatcher.addListener(
        'MOVE_TO_NEW_SCENE',
        this.onChildMoveToNewScene
      )
    }
  }

  onChildMoveToNewScene = (child: InSceneObjectInfo) => {
    child.eventDispatcher.removeListener(
      'MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    child.eventDispatcher.removeListener('DESTROY', this.onChildrenDestroyed)
    this.data.children = this.data.children.filter(c => c !== child.data)
    this.children = this.children.filter(c => c !== child)
  }

  onChildrenDestroyed = (child: ObjectInfo) => {
    child.eventDispatcher.removeListener(
      'MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    child.eventDispatcher.removeListener('DESTROY', this.onChildrenDestroyed)
    this.data.children = this.data.children.filter(c => c !== child.data)
    this.children = this.children.filter(c => c !== child)
  }

  findChildrenById(id: string): InSceneObjectInfo | null {
    if (this.config.id === id) {
      return this
    }

    for (const child of this.children) {
      const result = child.findChildrenById(id)
      if (result !== null) {
        return result
      }
    }
    return null
  }

  findChildrenByInSceneId(id: number): InSceneObjectInfo | null {
    if (this.config.inSceneId === id) {
      return this
    }

    for (const child of this.children) {
      const result = child.findChildrenByInSceneId(id)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  addObjectInSceneInfo(objectInfo: InSceneObjectInfo) {
    this.children.push(objectInfo)
    this.data.add(objectInfo.data as THREE.Object3D)
    objectInfo.eventDispatcher.addListener('DESTROY', this.onChildrenDestroyed)
    objectInfo.eventDispatcher.addListener(
      'MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
  }

  serialize() {
    return this.config
  }

  moveToNewScene(scene: SceneObjectInfo) {
    this.eventDispatcher.dispatch('MOVE_TO_NEW_SCENE', this)
    this.updateScene(scene)
    scene.addObjectInSceneInfo(this)
  }

  updateScene(scene: SceneObjectInfo) {
    this.config.sceneId = scene.config.sceneId
    this.config.inSceneId = this.data.id
    for (const child of this.children) {
      child.updateScene(scene)
    }
  }

  destroy = () => {
    for (const child of this.children) {
      this.objectInfoStorage.delete(child.config.id)
    }
    super.destroy()
  }
}
