import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class AmbientLightObjectInfo extends LightObjectInfo {
  declare data: THREE.AmbientLight
  constructor(
    data: THREE.AmbientLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, sceneId, objectInfoStorage)
  }
}
