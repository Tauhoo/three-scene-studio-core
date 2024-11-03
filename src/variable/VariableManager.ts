import * as z from 'zod'
import VariableStorage, { variableStorageConfigSchema } from './VariableStorage'
import { Variable } from '.'

export const variableManagerConfigSchema = z.object({
  variableStorageConfig: variableStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

class VariableManager {
  private variableStorage: VariableStorage

  constructor() {
    this.variableStorage = new VariableStorage()
  }

  addVariable(variable: Variable) {
    this.variableStorage.set(variable.id, variable)
  }

  getVariable(id: string) {
    return this.variableStorage.get(id)
  }

  getAllVariables() {
    return Object.values(this.variableStorage.getAll())
  }

  loadConfig(config: VariableManagerConfig) {
    this.variableStorage.loadConfig(config.variableStorageConfig)
  }

  serialize(): VariableManagerConfig {
    return {
      variableStorageConfig: this.variableStorage.serialize(),
    }
  }
}

export default VariableManager
