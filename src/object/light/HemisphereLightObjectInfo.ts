import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export class HemisphereLightObjectInfo extends LightObjectInfo {
  declare data: THREE.HemisphereLight
  constructor(
    data: THREE.HemisphereLight,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage, id)
  }
}
