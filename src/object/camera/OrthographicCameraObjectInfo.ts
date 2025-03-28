import * as THREE from 'three'
import { CameraObjectInfo } from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { PropertyTypeMap } from '../property'

export class OrthographicCameraObjectInfo extends CameraObjectInfo {
  static propertyTypeMap: PropertyTypeMap = {
    ...CameraObjectInfo.propertyTypeMap,
    left: { type: 'NUMBER' },
    right: { type: 'NUMBER' },
    top: { type: 'NUMBER' },
    bottom: { type: 'NUMBER' },
  }
  declare data: THREE.OrthographicCamera
  constructor(data: THREE.OrthographicCamera, id?: string) {
    super(data, id)
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
