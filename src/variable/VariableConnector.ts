import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfo, ObjectReference, objectReferenceSchema } from '../object'
import { assignValue } from '../utils/objectPath'
import { Variable } from '.'

export const objectPathSchema = z.array(z.string())
export type ObjectPath = z.infer<typeof objectPathSchema>

export const variableConnectorConfigSchema = z.object({
  id: z.string(),
  variableId: z.string(),
  objectReference: objectReferenceSchema,
  objectPath: objectPathSchema,
})

export type VariableConnectorConfig = z.infer<
  typeof variableConnectorConfigSchema
>

class VariableConnector {
  readonly id: string
  private variable: Variable
  private objectInfo: ObjectInfo
  private objectPath: ObjectPath
  private updateObject: (value: number) => void

  constructor(
    variable: Variable,
    objectInfo: ObjectInfo,
    objectPath: ObjectPath,
    id?: string
  ) {
    this.id = id ?? uuidv4()
    this.variable = variable
    this.objectInfo = objectInfo
    this.objectPath = objectPath
    this.updateObject = (value: number) => {
      let data = this.objectInfo as any
      assignValue(data, this.objectPath, value)
    }
    const originVariable: Variable = variable
    originVariable.dispatcher.addListener('VALUE_CHANGED', this.updateObject)
  }

  getVariable() {
    return this.variable
  }

  getObjectInfo(): ObjectInfo {
    return this.objectInfo
  }

  getObjectPath() {
    return this.objectPath
  }

  destroy() {
    const originVariable: Variable = this.variable
    originVariable.dispatcher.removeListener('VALUE_CHANGED', this.updateObject)
  }

  serialize(): VariableConnectorConfig {
    return {
      id: this.id,
      variableId: this.variable.serialize().id,
      objectReference: this.objectInfo.serialize() as ObjectReference,
      objectPath: this.objectPath,
    }
  }
}

export default VariableConnector
