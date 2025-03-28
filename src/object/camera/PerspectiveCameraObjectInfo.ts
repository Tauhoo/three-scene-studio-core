import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { PropertyTypeMap } from '../property'

export class PerspectiveCameraObjectInfo extends CameraObjectInfo {
  static propertyTypeMap: PropertyTypeMap = {
    ...CameraObjectInfo.propertyTypeMap,
    fov: { type: 'NUMBER' },
    aspect: { type: 'NUMBER' },
  }
  declare data: THREE.PerspectiveCamera
  constructor(data: THREE.PerspectiveCamera, id?: string) {
    super(data, id)
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
