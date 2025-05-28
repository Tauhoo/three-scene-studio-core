import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class PointLightObjectInfo extends LightObjectInfo {
  declare data: THREE.PointLight
  constructor(
    data: THREE.PointLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, sceneId, objectInfoStorage)
  }

  helper(value: boolean) {
    if (value) {
      this.data.add(new THREE.PointLightHelper(this.data, 1))
    } else {
      this.data.children = this.data.children.filter(
        child => !(child instanceof THREE.PointLightHelper)
      )
    }
    super.helper(value)
  }
}
