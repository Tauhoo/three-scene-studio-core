import { ObjectConfig, ObjectInfo } from './ObjectInfo'
import * as THREE from 'three'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import { getChildren } from './children'

export type InSceneIdentifier = {
  sceneId: number
  inSceneId: number
}

export type ObjectInSceneInfoConfig = ObjectConfig & InSceneIdentifier

export abstract class InSceneObjectInfo extends ObjectInfo {
  abstract readonly config: ObjectInSceneInfoConfig
  abstract readonly data: THREE.Object3D
  children: InSceneObjectInfo[]
  private objectInfoStorage: ObjectInfoStorage

  constructor(
    data: THREE.Object3D,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super()
    this.objectInfoStorage = objectInfoStorage
    this.children = getChildren(data, sceneId, objectInfoStorage)
    for (const child of this.children) {
      child.addListener('DESTROY', this.onChildrenDestroyed)
    }
  }

  onChildrenDestroyed = (child: ObjectInfo) => {
    child.removeListener('DESTROY', this.onChildrenDestroyed)
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
  }

  serialize() {
    return this.config
  }

  destroy = () => {
    for (const child of this.children) {
      this.objectInfoStorage.delete(child.config.id)
    }
    super.destroy()
  }
}
