import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { errorResponse, successResponse } from '../utils/response'
import { z } from 'zod'

export const objectPathSchema = z.array(z.string())
export type ObjectPath = z.infer<typeof objectPathSchema>

export interface ObjectConfig {
  type: string
  id: string
}

export type ObjectInfoEvent =
  | EventPacket<string & {}, any>
  | EventPacket<'DESTROY', ObjectInfo>
  | EventPacket<'DATA_VALUE_UPDATE', { objectPath: ObjectPath }>

export abstract class ObjectInfo {
  abstract readonly config: ObjectConfig
  abstract readonly data: any
  abstract readonly eventDispatcher: EventDispatcher<ObjectInfoEvent>
  serialize() {
    return this.config
  }

  setValue(objectPath: ObjectPath, value: any) {
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
    if (objectValue[objectPath[objectPath.length - 1]] !== value) {
      objectValue[objectPath[objectPath.length - 1]] = value
      this.eventDispatcher.dispatch('DATA_VALUE_UPDATE', { objectPath })
    }
    return successResponse(null)
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
}
