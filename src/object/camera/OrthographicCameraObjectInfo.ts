import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'

export class OrthographicCameraObjectInfo extends CameraObjectInfo {
  declare data: THREE.OrthographicCamera
  constructor(data: THREE.OrthographicCamera) {
    super(data)
  }
}
