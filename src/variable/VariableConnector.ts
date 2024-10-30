import { v4 as uuidv4 } from 'uuid'
import { ObjectInfos } from '../object'
import Variables from './variables'

export type ObjectPath = [number, ...string[]]

class VariableConnector {
  readonly id: string
  private variable: Variables
  private objectInfo: ObjectInfos
  private objectPath: ObjectPath
  private updateObject: (value: number) => void

  constructor(
    variable: Variables,
    objectInfo: ObjectInfos,
    objectPath: ObjectPath,
    id?: string
  ) {
    this.id = id ?? uuidv4()
    this.variable = variable
    this.objectInfo = objectInfo
    this.objectPath = objectPath
    this.updateObject = (value: number) => {
      let data = this.objectInfo.data as any
      for (let index = 0; index < objectPath.length - 1; index++) {
        const key = objectPath[index]
        data = data[key]
      }
      data[objectPath[objectPath.length - 1]] = value
    }
    this.variable.dispatcher.addListener('VALUE_CHANGED', this.updateObject)
  }

  getVariable() {
    return this.variable
  }

  getObjectInfo(): ObjectInfos {
    return this.objectInfo
  }

  getObjectPath() {
    return this.objectPath
  }

  destroy() {
    this.variable.dispatcher.removeListener('VALUE_CHANGED', this.updateObject)
  }

  serialize() {
    return {
      id: this.id,
      variableId: this.variable.serialize().id,
      objectReference: this.objectInfo.serialize(),
      objectPath: this.objectPath,
    }
  }
}

export default VariableConnector
