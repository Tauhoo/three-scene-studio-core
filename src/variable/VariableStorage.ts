import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import { createVariableFromConfig, Variable, variableConfigSchema } from '.'

export const variableStorageConfigSchema = z.object({
  variables: z.array(variableConfigSchema),
})

export type VariableStorageConfig = z.infer<typeof variableStorageConfigSchema>

class VariableStorage extends DataStorage<string, Variable> {
  constructor() {
    super(id => id)
  }

  loadConfig(config: VariableStorageConfig) {
    config.variables.forEach(variableConfig =>
      this.set(variableConfig.id, createVariableFromConfig(variableConfig))
    )
  }

  serialize(): VariableStorageConfig {
    return { variables: this.getAll().map(variable => variable.serialize()) }
  }
}

export default VariableStorage
