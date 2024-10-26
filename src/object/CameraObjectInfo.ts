import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'

export interface CameraObjectReference {
  type: 'OBJECT_3D_CAMERA'
  id: number
}

class CameraObjectInfo extends ObjectInfo<CameraObjectReference, THREE.Camera> {
  constructor(data: THREE.Camera) {
    super(
      {
        type: 'OBJECT_3D_CAMERA',
        id: data.id,
      },
      data
    )
  }
}

export const getDefaultCamera = (): THREE.Camera => {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100)
  camera.position.set(0, 0, 10)
  camera.lookAt(0, 0, 0)
  return camera
}

export default CameraObjectInfo
