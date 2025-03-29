import * as THREE from 'three'
import {
  CameraObjectInfo,
  cameraObjectInfoPropertyTypeDefinition,
} from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { MapTypeDefinition } from '../property'

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

  setValue(objectPath: ObjectPath, value: any, isVector?: boolean) {
    const result = super.setValue(objectPath, value, isVector)
    if (result.status === 'ERROR') {
      return result
    }

    if (objectPath.length === 1 && objectPath[0] === 'aspect') {
      this.data.updateProjectionMatrix()
    }
    return result
  }
}
