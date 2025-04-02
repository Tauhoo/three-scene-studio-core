import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfo, ObjectPath, objectPathSchema } from '../object'
import { FormulaVariable, Variable } from '.'
import {
  getProperyTypeFromMap,
  propertyTypeAndNodeValueTypeCompatible,
  PropertyTypeDefinition,
} from '../object/property'

export const variableConnectorConfigSchema = z.object({
  id: z.string(),
  variableId: z.string(),
  objectId: z.string(),
  objectPath: objectPathSchema,
})

export type VariableConnectorConfig = z.infer<
  typeof variableConnectorConfigSchema
>

export type ConnectorStatus =
  | { type: 'ACTIVE' }
  | { type: 'SOURCE_TARGET_TYPE_MISMATCH' }
  | { type: 'INVALID_OBJECT_PATH' }

export class VariableConnector {
  readonly id: string
  private variable: Variable
  private objectInfo: ObjectInfo
  private objectPath: ObjectPath
  private updateObject: ((value: any) => void) | null = null
  private status: ConnectorStatus = { type: 'ACTIVE' }

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
    this.setupUpdater()
    this.variable.dispatcher.addListener(
      'VALUE_TYPE_CHANGED',
      this.setupUpdater
    )
  }

  setupUpdater = () => {
    if (this.updateObject !== null) {
      this.variable.value.removeListener('VALUE_CHANGED', this.updateObject)
      this.updateObject = null
    }

    let propertyTypeDefinition: PropertyTypeDefinition
    const propertyTypePathResult = getProperyTypeFromMap(
      this.objectPath,
      this.objectInfo.propertyTypeDefinition
    )
    if (propertyTypePathResult.status === 'SUCCESS') {
      propertyTypeDefinition = propertyTypePathResult.data
    } else {
      // can't get property type definition from object path, so we use default value
      if (this.variable.value.valueType === 'NUMBER') {
        propertyTypeDefinition = { type: 'NUMBER' }
      } else {
        propertyTypeDefinition = { type: 'VECTOR_2D' }
      }
    }

    const compatibilityResult = propertyTypeAndNodeValueTypeCompatible(
      propertyTypeDefinition,
      this.variable.value.valueType
    )

    if (compatibilityResult.status === 'ERROR') {
      this.status = { type: 'SOURCE_TARGET_TYPE_MISMATCH' }
      return
    }
    if (
      propertyTypeDefinition.type === 'VECTOR_2D' ||
      propertyTypeDefinition.type === 'VECTOR_3D'
    ) {
      this.updateObject = (value: any) => {
        const result = this.objectInfo.setValue(this.objectPath, value, true)
        if (result.status === 'ERROR') {
          console.error(result.error)
        }
      }
    } else {
      this.updateObject = (value: any) => {
        const result = this.objectInfo.setValue(this.objectPath, value)
        if (result.status === 'ERROR') {
          console.error(result.error)
        }
      }
    }

    this.variable.value.addListener('VALUE_CHANGED', this.updateObject)
    this.updateObject(this.variable.value.get())
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

  getStatus() {
    return this.status
  }

  destroy() {
    if (this.updateObject !== null) {
      this.variable.value.removeListener('VALUE_CHANGED', this.updateObject)
    }
    this.variable.dispatcher.removeListener(
      'VALUE_TYPE_CHANGED',
      this.setupUpdater
    )
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
