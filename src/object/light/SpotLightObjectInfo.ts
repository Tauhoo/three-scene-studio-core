import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class SpotLightObjectInfo extends LightObjectInfo {
  declare data: THREE.SpotLight
  constructor(
    data: THREE.SpotLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }
}
