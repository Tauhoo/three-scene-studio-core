import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class PointLightObjectInfo extends LightObjectInfo {
  declare data: THREE.PointLight
  constructor(data: THREE.PointLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
