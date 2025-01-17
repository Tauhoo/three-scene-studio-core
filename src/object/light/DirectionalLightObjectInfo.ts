import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class DirectionalLightObjectInfo extends LightObjectInfo {
  declare data: THREE.DirectionalLight
  constructor(data: THREE.DirectionalLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
