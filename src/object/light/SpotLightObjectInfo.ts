import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class SpotLightObjectInfo extends LightObjectInfo {
  declare data: THREE.SpotLight
  constructor(data: THREE.SpotLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
