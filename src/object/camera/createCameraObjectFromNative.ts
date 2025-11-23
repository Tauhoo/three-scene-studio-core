import * as THREE from 'three'
import { PerspectiveCameraObjectInfo } from './PerspectiveCameraObjectInfo'
import { OrthographicCameraObjectInfo } from './OrthographicCameraObjectInfo'
import Context from '../../utils/Context'

export function createCameraObjectFromNative(
  camera: THREE.Camera,
  context: Context
) {
  if (camera instanceof THREE.PerspectiveCamera) {
    const result = new PerspectiveCameraObjectInfo(camera, context)
    return result
  } else if (camera instanceof THREE.OrthographicCamera) {
    const result = new OrthographicCameraObjectInfo(camera, context)
    return result
  } else {
    throw new Error('Invalid camera type')
  }
}
