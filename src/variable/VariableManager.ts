import * as z from 'zod'
import VariableStorage, { variableStorageConfigSchema } from './VariableStorage'
import VariableConnectorStorage, {
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import { ObjectInfoManager } from '../object'
import Context from '../utils/Context'

export const variableManagerConfigSchema = z.object({
  variableStorageConfig: variableStorageConfigSchema,
  variableConnectorStorageConfig: variableConnectorStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

class VariableManager {
  readonly variableStorage: VariableStorage
  readonly variableConnectorStorage: VariableConnectorStorage

  constructor() {
    this.variableStorage = new VariableStorage()
    this.variableConnectorStorage = new VariableConnectorStorage()
  }

  loadConfig(
    context: Context,
    config: VariableManagerConfig,
    objectInfoManager: ObjectInfoManager
  ) {
    this.variableStorage.loadConfig(context, config.variableStorageConfig)
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
