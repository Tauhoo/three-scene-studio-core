import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { InSceneObjectInfo } from '../InSceneObjectInfo'

export class HemisphereLightObjectInfo extends LightObjectInfo {
  declare data: THREE.HemisphereLight
  constructor(
    data: THREE.HemisphereLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    super(data, sceneId, objectInfoStorage, id, children)
  }

  helper(value: boolean) {
    if (value) {
      this.data.add(new THREE.HemisphereLightHelper(this.data, 1))
    } else {
      this.data.children = this.data.children.filter(
        child => !(child instanceof THREE.HemisphereLightHelper)
      )
    }
    super.helper(value)
  }
}
