import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class DirectionalLightObjectInfo extends LightObjectInfo {
  declare data: THREE.DirectionalLight
  constructor(
    data: THREE.DirectionalLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }

  helper(value: boolean) {
    if (value) {
      this.data.add(new THREE.DirectionalLightHelper(this.data))
    } else {
      this.data.children = this.data.children.filter(
        child => !(child instanceof THREE.DirectionalLightHelper)
      )
    }
    super.helper(value)
  }
}
