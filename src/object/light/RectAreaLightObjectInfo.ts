import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class RectAreaLightObjectInfo extends LightObjectInfo {
  declare data: THREE.RectAreaLight
  constructor(data: THREE.RectAreaLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
