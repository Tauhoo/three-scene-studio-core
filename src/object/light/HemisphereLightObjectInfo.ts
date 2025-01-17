import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'

export class HemisphereLightObjectInfo extends LightObjectInfo {
  declare data: THREE.HemisphereLight
  constructor(data: THREE.HemisphereLight, sceneId: number, id?: string) {
    super(data, sceneId, id)
  }
}
