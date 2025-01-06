import { CameraObjectInfo, ObjectInfo } from '../object'
import { ObjectPath } from '../variable'

export function assignValue(
  object: ObjectInfo,
  objectPath: ObjectPath,
  value: any
) {
  let objectValue = object as any
  for (let index = 0; index < objectPath.length - 1; index++) {
    const key = objectPath[index]
    if (objectValue[key] === undefined) {
      objectValue[key] = {}
    }
    objectValue = objectValue[key]
  }
  objectValue[objectPath[objectPath.length - 1]] = value

  if (object instanceof CameraObjectInfo) {
    object.onChangeValue()
  }
}

export function extractValue(object: any, objectPath: ObjectPath) {
  for (let index = 0; index < objectPath.length - 1; index++) {
    const key = objectPath[index]
    if (object[key] === undefined) {
      return null
    }
    object = object[key]
  }
  return object[objectPath[objectPath.length - 1]]
}
