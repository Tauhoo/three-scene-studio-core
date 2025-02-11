import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'

export class PerspectiveCameraObjectInfo extends CameraObjectInfo {
  declare data: THREE.PerspectiveCamera
  constructor(data: THREE.PerspectiveCamera) {
    super(data)
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    if (result.status === 'ERROR') {
      return result
    }

    if (objectPath.length === 1 && objectPath[0] === 'aspect') {
      this.data.updateProjectionMatrix()
    }
    return result
  }
}
