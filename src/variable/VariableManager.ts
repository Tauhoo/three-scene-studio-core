import * as z from 'zod'
import VariableStorage, { variableStorageConfigSchema } from './VariableStorage'
import { Variable } from '.'
import VariableConnectorStorage, {
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import { ObjectInfoManager } from '../object'

export const variableManagerConfigSchema = z.object({
  variableStorageConfig: variableStorageConfigSchema,
  variableConnectorStorageConfig: variableConnectorStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

class VariableManager {
  private variableStorage: VariableStorage
  private variableConnectorStorage: VariableConnectorStorage

  constructor() {
    this.variableStorage = new VariableStorage()
    this.variableConnectorStorage = new VariableConnectorStorage()
  }

  loadConfig(
    config: VariableManagerConfig,
    objectInfoManager: ObjectInfoManager
  ) {
    this.variableStorage.loadConfig(config.variableStorageConfig)
    this.variableConnectorStorage.loadConfig(
      config.variableConnectorStorageConfig,
      objectInfoManager,
      this.variableStorage
    )
  }

  serialize(): VariableManagerConfig {
    return {
      variableStorageConfig: this.variableStorage.serialize(),
      variableConnectorStorageConfig: this.variableConnectorStorage.serialize(),
    }
  }
}

export default VariableManager
