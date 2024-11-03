import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import VariableConnector, {
  variableConnectorConfigSchema,
} from './VariableConnector'
import VariableManager from './VariableManager'

export const variableConnectorStorageConfigSchema = z.object({
  connectors: z.array(variableConnectorConfigSchema),
})
export type VariableConnectorStorageConfig = z.infer<
  typeof variableConnectorStorageConfigSchema
>

class VariableConnectorStorage extends DataStorage<string, VariableConnector> {
  private objectInfoManager: ObjectInfoManager
  private variableManager: VariableManager
  constructor(
    objectInfoManager: ObjectInfoManager,
    variableManager: VariableManager
  ) {
    super(id => id)
    this.objectInfoManager = objectInfoManager
    this.variableManager = variableManager
  }

  loadConfig(config: VariableConnectorStorageConfig) {
    config.connectors.forEach(connector => {
      const variable = this.variableManager.getVariable(connector.variableId)
      const object = this.objectInfoManager.getObjectInfoByReference(
        connector.objectReference
      )
      const objectPath = connector.objectPath
      if (variable === null || object === null) {
        return
      }
      this.set(
        connector.id,
        new VariableConnector(variable, object, objectPath)
      )
    })
  }
  serialize() {
    return { connectors: this.getAll().map(connector => connector.serialize()) }
  }
}

export default VariableConnectorStorage
