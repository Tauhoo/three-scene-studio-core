import * as THREE from 'three'
import {
  CameraObjectInfo,
  cameraObjectInfoPropertyTypeDefinition,
} from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { MapTypeDefinition } from '../property'
import { SystemValueType } from '../../utils'
import Context from '../../utils/Context'

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
  constructor(data: THREE.PerspectiveCamera, private context: Context) {
    super(data)
    context.addListener('CANVAS_RESIZE', this.onCanvasResize)
  }

  onCanvasResize = (data: { width: number; height: number }) => {
    this.data.aspect = data.width / data.height
    this.data.updateProjectionMatrix()
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

  destroy = () => {
    this.context.removeListener('CANVAS_RESIZE', this.onCanvasResize)
    super.destroy()
  }
}
