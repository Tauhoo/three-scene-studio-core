import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class AmbientLightObjectInfo extends LightObjectInfo {
  declare data: THREE.AmbientLight
  constructor(data: THREE.AmbientLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
