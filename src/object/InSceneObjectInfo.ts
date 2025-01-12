import { ObjectConfig, ObjectInfo } from './ObjectInfo'
import * as THREE from 'three'

export type InSceneIdentifier = {
  sceneId: number
  inSceneId: number
}

export type ObjectInSceneInfoConfig = ObjectConfig & InSceneIdentifier

export abstract class InSceneObjectInfo extends ObjectInfo {
  abstract readonly config: ObjectInSceneInfoConfig
  abstract readonly data: THREE.Object3D
  abstract children: InSceneObjectInfo[]

  constructor() {
    super()
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
}
