import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'

export class PerspectiveCameraObjectInfo extends CameraObjectInfo {
  declare data: THREE.PerspectiveCamera
  constructor(data: THREE.PerspectiveCamera) {
    super(data)
  }
}
