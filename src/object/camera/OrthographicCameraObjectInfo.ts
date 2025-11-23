import * as THREE from 'three'
import {
  CameraObjectInfo,
  cameraObjectInfoPropertyTypeDefinition,
} from './CameraObjectInfo'
import { ObjectPath } from '../ObjectInfo'
import { MapTypeDefinition } from '../property'
import { SystemValueType } from '../../utils'
import Context from '../../utils/Context'

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
  constructor(data: THREE.OrthographicCamera, private context: Context) {
    super(data)
    context.addListener('CANVAS_RESIZE', this.onCanvasResize)
  }

  onCanvasResize = (data: { width: number; height: number }) => {
    this.data.left = -data.width / 2
    this.data.right = data.width / 2
    this.data.top = data.height / 2
    this.data.bottom = -data.height / 2
    this.data.updateProjectionMatrix()
  }

  setValue(objectPath: ObjectPath, value: any, valueType?: SystemValueType) {
    const result = super.setValue(objectPath, value, valueType)
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

  destroy = () => {
    this.context.removeListener('CANVAS_RESIZE', this.onCanvasResize)
    super.destroy()
  }
}
