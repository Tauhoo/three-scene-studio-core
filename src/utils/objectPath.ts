import { ObjectPath } from '../variable'

export function assignValue(object: any, objectPath: ObjectPath, value: any) {
  for (let index = 0; index < objectPath.length - 1; index++) {
    const key = objectPath[index]
    if (object[key] === undefined) {
      object[key] = {}
    }
    object = object[key]
  }
  object[objectPath[objectPath.length - 1]] = value
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
