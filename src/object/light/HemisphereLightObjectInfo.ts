import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class HemisphereLightObjectInfo extends LightObjectInfo {
  declare data: THREE.HemisphereLight
  constructor(
    data: THREE.HemisphereLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
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
