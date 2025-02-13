import * as THREE from 'three'
import { LightObjectInfo } from './LightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { InSceneObjectInfo } from '../InSceneObjectInfo'

export class AmbientLightObjectInfo extends LightObjectInfo {
  declare data: THREE.AmbientLight
  constructor(
    data: THREE.AmbientLight,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    super(data, sceneId, objectInfoStorage, id, children)
  }
}
