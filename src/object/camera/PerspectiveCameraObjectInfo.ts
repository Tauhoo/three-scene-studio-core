import * as THREE from 'three'
import {
  CameraObjectInfo,
  cameraObjectInfoPropertyTypeDefinition,
} from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { MapTypeDefinition } from '../property'
import { SystemValueType } from '../../utils'

const perspectiveCameraObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...cameraObjectInfoPropertyTypeDefinition.map,
    fov: { type: 'NUMBER' },
    aspect: { type: 'NUMBER' },
  },
}
export class PerspectiveCameraObjectInfo extends CameraObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    perspectiveCameraObjectInfoPropertyTypeDefinition
  declare data: THREE.PerspectiveCamera
  constructor(data: THREE.PerspectiveCamera, id?: string) {
    super(data, id)
  }

  setValue(objectPath: ObjectPath, value: any, valueType?: SystemValueType) {
    const result = super.setValue(objectPath, value, valueType)
    if (result.status === 'ERROR') {
      return result
    }

    if (objectPath.length === 1 && objectPath[0] === 'aspect') {
      this.data.updateProjectionMatrix()
    }
    return result
  }
}
