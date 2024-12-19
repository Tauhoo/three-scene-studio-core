import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import VariableConnector, {
  variableConnectorConfigSchema,
} from './VariableConnector'
import VariableManager from './VariableManager'
import VariableStorage from './VariableStorage'

export const variableConnectorStorageConfigSchema = z.object({
  connectors: z.array(variableConnectorConfigSchema),
})
export type VariableConnectorStorageConfig = z.infer<
  typeof variableConnectorStorageConfigSchema
>

class VariableConnectorStorage extends DataStorage<string, VariableConnector> {
  private variableStorage: VariableStorage

  constructor() {
    super(id => id)
    this.variableStorage = new VariableStorage()
  }

  loadConfig(
    config: VariableConnectorStorageConfig,
    objectInfoManager: ObjectInfoManager
  ) {
    config.connectors.forEach(connector => {
      const variable = this.variableStorage.getVariableById(
        connector.variableId
      )
      const object = objectInfoManager.getObjectInfoByReference(
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
  serialize(): VariableConnectorStorageConfig {
    return { connectors: this.getAll().map(connector => connector.serialize()) }
  }
}

export default VariableConnectorStorage
