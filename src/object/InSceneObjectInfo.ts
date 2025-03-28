import {
  ObjectConfig,
  objectConfigSchema,
  ObjectInfo,
  ObjectInfoEvent,
  ObjectPath,
} from './ObjectInfo'
import * as THREE from 'three'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import { getChildren } from './children'
import { SceneObjectInfo } from './SceneObjectInfo'
import { EventPacket } from '../utils'
import EventDispatcher from '../utils/EventDispatcher'
import { z } from 'zod'
import { PropertyTypeMap } from './property'

export const inSceneObjectInfoConfigSchema = objectConfigSchema.extend({
  sceneId: z.string(),
  childrenIds: z.array(z.string()),
})

export type InSceneObjectInfoConfig = z.infer<
  typeof inSceneObjectInfoConfigSchema
>

export type InSceneObjectInfoEvent =
  | EventPacket<'DESTROY', InSceneObjectInfo>
  | EventPacket<
      'NEW_OBJECT_ADDED',
      { object: InSceneObjectInfo; parent: InSceneObjectInfo }
    >
  | EventPacket<
      'MOVE_TO_NEW_SCENE',
      { object: InSceneObjectInfo; to: SceneObjectInfo }
    >
  | EventPacket<
      'CHILD_MOVE_TO_NEW_SCENE',
      { level: number; object: InSceneObjectInfo; to: SceneObjectInfo }
    >
  | EventPacket<
      'CHILD_NAME_CHANGE',
      { level: number; from: string; to: string; parent: InSceneObjectInfo }
    >
  | EventPacket<
      'CHILD_DESTROY',
      { level: number; object: InSceneObjectInfo; parent: InSceneObjectInfo }
    >
  | EventPacket<'HELPER_CHANGE', { enabled: boolean }>
  | ObjectInfoEvent

export abstract class InSceneObjectInfo extends ObjectInfo {
  static propertyTypeMap: PropertyTypeMap = {
    name: { type: 'STRING' },
    position: { type: 'VECTOR_3D' },
    rotation: { type: 'VECTOR_3D' },
    scale: { type: 'VECTOR_3D' },
  }

  abstract readonly config: InSceneObjectInfoConfig
  abstract readonly data: THREE.Object3D
  children: InSceneObjectInfo[]
  protected objectInfoStorage: ObjectInfoStorage
  abstract readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>
  private _helperEnabled = false

  constructor(
    data: THREE.Object3D,
    id: string,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    children?: InSceneObjectInfo[]
  ) {
    super()
    data.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID'] = id
    this.objectInfoStorage = objectInfoStorage
    this.children = children ?? getChildren(data, sceneId, objectInfoStorage)
    for (const child of this.children) {
      child.eventDispatcher.addListener('DESTROY', this.onChildrenDestroyed)
      child.eventDispatcher.addListener(
        'MOVE_TO_NEW_SCENE',
        this.onChildMoveToNewScene
      )
      child.eventDispatcher.addListener(
        'CHILD_MOVE_TO_NEW_SCENE',
        this.onDeptChildMoveToNewScene
      )
      child.eventDispatcher.addListener(
        'CHILD_NAME_CHANGE',
        this.onDeptChildNameChange
      )
      child.eventDispatcher.addListener(
        'CHILD_DESTROY',
        this.onDeptChildDestroy
      )
    }
  }

  onDeptChildDestroy = (data: {
    level: number
    object: InSceneObjectInfo
    parent: InSceneObjectInfo
  }) => {
    this.eventDispatcher.dispatch('CHILD_DESTROY', {
      ...data,
      level: data.level + 1,
      parent: this,
    })
  }

  onDeptChildNameChange = (data: {
    level: number
    from: string
    to: string
    parent: InSceneObjectInfo
  }) => {
    this.eventDispatcher.dispatch('CHILD_NAME_CHANGE', {
      ...data,
      level: data.level + 1,
      parent: this,
    })
  }

  onDeptChildMoveToNewScene = (data: {
    level: number
    object: InSceneObjectInfo
    to: SceneObjectInfo
  }) => {
    this.eventDispatcher.dispatch('CHILD_MOVE_TO_NEW_SCENE', {
      ...data,
      level: data.level + 1,
    })
  }

  onChildMoveToNewScene = (data: {
    object: InSceneObjectInfo
    to: SceneObjectInfo
  }) => {
    if (data.to.config.id === this.config.sceneId) return
    data.object.eventDispatcher.removeListener(
      'MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    data.object.eventDispatcher.removeListener(
      'DESTROY',
      this.onChildrenDestroyed
    )
    this.data.children = this.data.children.filter(c => c !== data.object.data)
    this.children = this.children.filter(c => c !== data.object)
    this.eventDispatcher.dispatch('CHILD_MOVE_TO_NEW_SCENE', {
      level: 1,
      object: data.object,
      to: data.to,
    })
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

  findChildrenByName(name: string): InSceneObjectInfo[] {
    const result: InSceneObjectInfo[] = []
    if (this.data.name === name) {
      result.push(this)
    }

    for (const child of this.children) {
      const childResult = child.findChildrenByName(name)
      result.push(...childResult)
    }

    return result
  }

  addObjectInSceneInfo(objectInfo: InSceneObjectInfo) {
    this.children.push(objectInfo)
    this.data.add(objectInfo.data as THREE.Object3D)
    objectInfo.eventDispatcher.addListener('DESTROY', this.onChildrenDestroyed)
    objectInfo.eventDispatcher.addListener(
      'MOVE_TO_NEW_SCENE',
      this.onChildMoveToNewScene
    )
    objectInfo.eventDispatcher.addListener(
      'CHILD_MOVE_TO_NEW_SCENE',
      this.onDeptChildMoveToNewScene
    )
    objectInfo.eventDispatcher.addListener(
      'CHILD_NAME_CHANGE',
      this.onDeptChildNameChange
    )
    this.eventDispatcher.dispatch('NEW_OBJECT_ADDED', {
      object: objectInfo,
      parent: this,
    })
  }

  serialize() {
    return this.config
  }

  moveToNewScene(scene: SceneObjectInfo) {
    this.updateScene(scene)
    scene.addObjectInSceneInfo(this)
    this.eventDispatcher.dispatch('MOVE_TO_NEW_SCENE', {
      object: this,
      to: scene,
    })
  }

  updateScene(scene: SceneObjectInfo) {
    this.config.sceneId = scene.config.id
    for (const child of this.children) {
      child.updateScene(scene)
    }
  }

  setValue(objectPath: ObjectPath, value: any) {
    const from = this.data.name
    const to = value
    const setResult = super.setValue(objectPath, value)
    if (objectPath.join('.') === 'name') {
      this.eventDispatcher.dispatch('CHILD_NAME_CHANGE', {
        level: 1,
        from,
        to,
        parent: this,
      })
    }
    return setResult
  }

  calculateObjectBounds() {
    const box = new THREE.Box3().setFromObject(this.data)
    const size = new THREE.Vector3()
    box.getSize(size)
    return {
      width: size.x,
      height: size.y,
      depth: size.z,
    }
  }

  traverseChildren(callback: (child: InSceneObjectInfo) => void) {
    callback(this)
    for (const child of this.children) {
      child.traverseChildren(callback)
    }
  }

  destroy() {
    for (const child of this.children) {
      child.eventDispatcher.removeListener('DESTROY', this.onChildrenDestroyed)
      child.eventDispatcher.removeListener(
        'MOVE_TO_NEW_SCENE',
        this.onChildMoveToNewScene
      )
      child.eventDispatcher.removeListener(
        'CHILD_MOVE_TO_NEW_SCENE',
        this.onDeptChildMoveToNewScene
      )
      child.eventDispatcher.removeListener(
        'CHILD_NAME_CHANGE',
        this.onDeptChildNameChange
      )
      child.eventDispatcher.removeListener(
        'CHILD_DESTROY',
        this.onDeptChildDestroy
      )
    }
    for (const child of this.children) {
      this.objectInfoStorage.delete(child.config.id)
    }
    this.helper(false)
    super.destroy()
  }

  helper(boolean: boolean) {
    this.eventDispatcher.dispatch('HELPER_CHANGE', {
      enabled: boolean,
    })
    this._helperEnabled = boolean
  }

  isHelperEnabled(): boolean {
    return this._helperEnabled
  }
}
