import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class SpotLightObjectInfo extends LightObjectInfo {
  declare data: THREE.SpotLight
  constructor(
    data: THREE.SpotLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, sceneId, objectInfoStorage)
  }

  helper(value: boolean) {
    if (value) {
      this.data.add(new THREE.SpotLightHelper(this.data))
    } else {
      this.data.children = this.data.children.filter(
        child => !(child instanceof THREE.SpotLightHelper)
      )
    }
    super.helper(value)
  }
}
