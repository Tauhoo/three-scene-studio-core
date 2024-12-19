import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import { createVariableFromConfig, Variable, variableConfigSchema } from '.'

export const variableStorageConfigSchema = z.object({
  variables: z.array(variableConfigSchema),
})

export type VariableStorageConfig = z.infer<typeof variableStorageConfigSchema>

class VariableStorage {
  private refStorage: DataStorage<string, Variable>
  private idStorage: DataStorage<string, Variable>

  constructor() {
    this.refStorage = new DataStorage<string, Variable>(ref => ref)
    this.idStorage = new DataStorage<string, Variable>(id => id)
  }

  getVariableByRef(ref: string) {
    return this.refStorage.get(ref)
  }

  getVariableById(id: string) {
    return this.idStorage.get(id)
  }

  loadConfig(config: VariableStorageConfig) {
    config.variables.forEach(variableConfig => {
      const variable = createVariableFromConfig(variableConfig)
      if (variable) {
        this.refStorage.set(variableConfig.ref, variable)
        this.idStorage.set(variableConfig.id, variable)
      }
    })
  }

  serialize(): VariableStorageConfig {
    return {
      variables: this.idStorage.getAll().map(variable => variable.serialize()),
    }
  }
}

export default VariableStorage
