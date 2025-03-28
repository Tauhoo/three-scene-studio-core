import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import {
  MeshObjectInfo,
  ObjectInfo,
  ObjectPath,
  objectPathSchema,
} from '../object'
import { FormulaVariable, Variable } from '.'

export const variableConnectorConfigSchema = z.object({
  id: z.string(),
  variableId: z.string(),
  objectId: z.string(),
  objectPath: objectPathSchema,
})

export type VariableConnectorConfig = z.infer<
  typeof variableConnectorConfigSchema
>

export class VariableConnector {
  readonly id: string
  private variable: Variable
  private objectInfo: ObjectInfo
  private objectPath: ObjectPath
  private updateObject: (value: number | number[]) => void

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
    this.updateObject = (value: number | number[]) => {
      const result = this.objectInfo.setValue(this.objectPath, value)
      if (result.status === 'ERROR') {
        console.error(result.error)
      }
    }
    const originVariable: Variable = variable
    originVariable.value.addListener('VALUE_CHANGED', this.updateObject)
    this.updateObject(originVariable.value.get())
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
    originVariable.value.removeListener('VALUE_CHANGED', this.updateObject)
  }

  serialize(): VariableConnectorConfig {
    return {
      id: this.id,
      variableId: this.variable.id,
      objectId: this.objectInfo.config.id,
      objectPath: this.objectPath,
    }
  }
}
