import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class AmbientLightObjectInfo extends LightObjectInfo {
  declare data: THREE.AmbientLight
  constructor(
    data: THREE.AmbientLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }
}
