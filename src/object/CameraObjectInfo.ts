import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

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

export class CameraObjectInfoStorage extends DataStorage<
  CameraObjectReference,
  CameraObjectInfo
> {
  constructor(cameras: THREE.Camera[]) {
    super(reference => reference.id.toString())
    cameras.forEach(camera => {
      const cameraObjectInfo = new CameraObjectInfo(camera)
      this.set(cameraObjectInfo.reference, cameraObjectInfo)
    })
  }
}
