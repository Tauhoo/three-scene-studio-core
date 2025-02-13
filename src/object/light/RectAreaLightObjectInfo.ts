import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { InSceneObjectInfo } from '../InSceneObjectInfo'

export class RectAreaLightObjectInfo extends LightObjectInfo {
  declare data: THREE.RectAreaLight
  constructor(
    data: THREE.RectAreaLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    super(data, sceneId, objectInfoStorage, id, children)
  }

  helper(value: boolean) {
    if (value) {
      this.data.add(new THREE.BoxHelper(this.data))
    } else {
      this.data.children = this.data.children.filter(
        child => !(child instanceof THREE.BoxHelper)
      )
    }
    super.helper(value)
  }
}
