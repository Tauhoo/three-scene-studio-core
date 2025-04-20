import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { errorResponse, successResponse } from '../utils/response'
import { z } from 'zod'
import { MapTypeDefinition } from './property'
import { SystemValueType } from '../utils'

export const objectPathSchema = z.array(z.string())
export type ObjectPath = z.infer<typeof objectPathSchema>

export const objectConfigSchema = z.object({
  type: z.string(),
  id: z.string(),
})

export type ObjectConfig = z.infer<typeof objectConfigSchema>

export type ObjectInfoEvent =
  | EventPacket<string & {}, any>
  | EventPacket<'DESTROY', ObjectInfo>
  | EventPacket<'DATA_VALUE_UPDATE', { objectPath: ObjectPath }>

export const objectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {},
}

export abstract class ObjectInfo {
  propertyTypeDefinition: MapTypeDefinition = objectInfoPropertyTypeDefinition
  abstract readonly config: ObjectConfig
  abstract readonly data: any
  abstract readonly eventDispatcher: EventDispatcher<ObjectInfoEvent>

  serialize() {
    return this.config
  }

  setValue(
    objectPath: ObjectPath,
    value: any,
    systemValueType?: SystemValueType
  ) {
    if (objectPath.length === 0) {
      return errorResponse('INVALID_OBJECT_PATH', 'Invalid object path')
    }
    let objectValue = this.data
    for (let index = 0; index < objectPath.length - 1; index++) {
      const key = objectPath[index]
      if (objectValue[key] === undefined) {
        return errorResponse(
          'PROPERTY_NOT_FOUND',
          'Property not found: ' + objectPath.join('.')
        )
      }
      objectValue = objectValue[key]
    }

    let isUpdated = false
    if (
      systemValueType === 'VECTOR_3D' ||
      systemValueType === 'VECTOR_2D' ||
      systemValueType === 'EULER'
    ) {
      if (
        value[0] !== undefined &&
        objectValue[objectPath[objectPath.length - 1]].x !== value[0]
      ) {
        objectValue[objectPath[objectPath.length - 1]].x = value[0]
        isUpdated = true
      }

      if (
        value[1] !== undefined &&
        objectValue[objectPath[objectPath.length - 1]].y !== value[1]
      ) {
        objectValue[objectPath[objectPath.length - 1]].y = value[1]
        isUpdated = true
      }

      if (
        value[2] !== undefined &&
        objectValue[objectPath[objectPath.length - 1]].z !== value[2]
      ) {
        objectValue[objectPath[objectPath.length - 1]].z = value[2]
        isUpdated = true
      }
    } else if (systemValueType === 'VECTOR') {
      const list = objectValue[objectPath[objectPath.length - 1]]
      if (Array.isArray(value)) {
        for (let index = 0; index < list.length; index++) {
          if (
            value[index] !== undefined ||
            list[index] !== undefined ||
            list[index] !== value[index]
          ) {
            list[index] = value[index]
            isUpdated = true
          }
        }
      }
    } else {
      if (objectValue[objectPath[objectPath.length - 1]] !== value) {
        objectValue[objectPath[objectPath.length - 1]] = value
        isUpdated = true
      }
    }

    if (isUpdated) {
      this.eventDispatcher.dispatch('DATA_VALUE_UPDATE', { objectPath })
    }

    return successResponse(isUpdated)
  }

  getValue(objectPath: ObjectPath) {
    let object = this.data
    for (let index = 0; index < objectPath.length - 1; index++) {
      const key = objectPath[index]
      if (object[key] === undefined) {
        return errorResponse(
          'PROPERTY_NOT_FOUND',
          'Property not found: ' + objectPath.join('.')
        )
      }
      object = object[key]
    }
    return successResponse(object[objectPath[objectPath.length - 1]])
  }

  destroy() {
    this.eventDispatcher.dispatch('DESTROY', this)
  }

  unique() {
    return false
  }
}
