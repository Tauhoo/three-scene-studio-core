import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import VariableConnector, { ObjectPath } from './VariableConnector'
import VariableConnectorStorage, {
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import VariableManager from './VariableManager'
import { Variable } from '.'
import { ObjectInfo } from '../object'

export const VariableConnectorManagerConfigSchema = z.object({
  variableConnectorStorage: variableConnectorStorageConfigSchema,
})
export type VariableConnectorManagerConfig = z.infer<
  typeof VariableConnectorManagerConfigSchema
>

class VariableConnectorManager {
  private variableConnectorStorage: VariableConnectorStorage

  constructor(
    objectInfoManager: ObjectInfoManager,
    variableManager: VariableManager
  ) {
    this.variableConnectorStorage = new VariableConnectorStorage(
      objectInfoManager,
      variableManager
    )
  }

  connect(variable: Variable, object: ObjectInfo, objectPath: ObjectPath) {
    const connector = new VariableConnector(variable, object, objectPath)
    this.variableConnectorStorage.set(connector.id, connector)
    return connector
  }

  destroy(id: string) {
    this.variableConnectorStorage.delete(id)
  }

  loadConfig(config: VariableConnectorManagerConfig) {
    this.variableConnectorStorage.loadConfig(config.variableConnectorStorage)
  }

  serialize() {
    return {
      variableConnectorStorage: this.variableConnectorStorage.serialize(),
    }
  }
}

export default VariableConnectorManager
