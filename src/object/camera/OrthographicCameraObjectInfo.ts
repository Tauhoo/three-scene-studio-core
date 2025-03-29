import * as THREE from 'three'
import {
  CameraObjectInfo,
  cameraObjectInfoPropertyTypeDefinition,
} from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { MapTypeDefinition } from '../property'

const orthographicCameraObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...cameraObjectInfoPropertyTypeDefinition.map,
    left: { type: 'NUMBER' },
    right: { type: 'NUMBER' },
    top: { type: 'NUMBER' },
    bottom: { type: 'NUMBER' },
  },
}
export class OrthographicCameraObjectInfo extends CameraObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    orthographicCameraObjectInfoPropertyTypeDefinition
  declare data: THREE.OrthographicCamera
  constructor(data: THREE.OrthographicCamera, id?: string) {
    super(data, id)
  }

  setValue(objectPath: ObjectPath, value: any, isVector?: boolean) {
    const result = super.setValue(objectPath, value, isVector)
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
