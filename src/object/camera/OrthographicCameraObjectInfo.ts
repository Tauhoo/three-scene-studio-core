import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'

export class OrthographicCameraObjectInfo extends CameraObjectInfo {
  declare data: THREE.OrthographicCamera
  constructor(data: THREE.OrthographicCamera) {
    super(data)
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    if (result.status === 'ERROR') {
      return result
    }

    if (
      objectPath.length === 1 &&
      (objectPath[0] === 'left' ||
        objectPath[0] === 'right' ||
        objectPath[0] === 'top' ||
        objectPath[0] === 'bottom')
    ) {
      this.data.updateProjectionMatrix()
    }
    return result
  }
}
