import * as THREE from 'three'
import { PerspectiveCameraObjectInfo } from './PerspectiveCameraObjectInfo'
import { OrthographicCameraObjectInfo } from './OrthographicCameraObjectInfo'

export function createCameraObjectFromNative(camera: THREE.Camera) {
  if (camera instanceof THREE.PerspectiveCamera) {
    const result = new PerspectiveCameraObjectInfo(camera)
    return result
  } else if (camera instanceof THREE.OrthographicCamera) {
    const result = new OrthographicCameraObjectInfo(camera)
    return result
  } else {
    throw new Error('Invalid camera type')
  }
}
