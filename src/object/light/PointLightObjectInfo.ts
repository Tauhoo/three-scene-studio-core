import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class PointLightObjectInfo extends LightObjectInfo {
  declare data: THREE.PointLight
  constructor(
    data: THREE.PointLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }
}
