import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class RectAreaLightObjectInfo extends LightObjectInfo {
  declare data: THREE.RectAreaLight
  constructor(
    data: THREE.RectAreaLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }
}
