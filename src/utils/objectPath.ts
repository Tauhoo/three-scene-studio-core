import { ObjectPath } from '../variable'

export function assignValue(object: any, objectPath: ObjectPath, value: any) {
  for (let index = 0; index < objectPath.length - 1; index++) {
    const key = objectPath[index]
    object = object[key]
  }
  object[objectPath[objectPath.length - 1]] = value
}
