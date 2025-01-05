import * as THREE from 'three'
import { PerspectiveCameraObjectInfo } from './PerspectiveCameraObjectInfo'
import { OrthographicCameraObjectInfo } from './OrthographicCameraObjectInfo'

export type SharedCameraInfo = {
  name: string
  near: number
  far: number
}

export type PerspectiveCameraInfo = {
  type: 'perspective'
  fov: number
  aspect: number
}

export type OrthographicCameraInfo = {
  type: 'orthographic'
  width: number
  height: number
}

export type CameraInfo = SharedCameraInfo &
  (PerspectiveCameraInfo | OrthographicCameraInfo)

function createCameraObjectFromInfo(info: CameraInfo) {
  if (info.type === 'perspective') {
    const camera = new THREE.PerspectiveCamera(
      info.fov,
      info.aspect,
      info.near,
      info.far
    )
    const result = new PerspectiveCameraObjectInfo(camera)
    result.name = info.name
    return result
  } else {
    const camera = new THREE.OrthographicCamera(
      -info.width / 2,
      info.width / 2,
      info.height / 2,
      -info.height / 2,
      info.near,
      info.far
    )
    const result = new OrthographicCameraObjectInfo(camera)
    result.name = info.name
    return result
  }
}

export default createCameraObjectFromInfo
