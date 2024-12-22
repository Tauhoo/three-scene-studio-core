import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import {
  createVariableFromConfig,
  SystemVariable,
  variableConfigSchema,
} from '.'
import { ReferrableVariable } from './ReferrableVariable'

export const variableStorageConfigSchema = z.object({
  variables: z.array(variableConfigSchema),
})

export type VariableStorageConfig = z.infer<typeof variableStorageConfigSchema>

class VariableStorage {
  private refStorage: DataStorage<string, SystemVariable>
  private idStorage: DataStorage<string, SystemVariable>

  constructor() {
    this.refStorage = new DataStorage<string, SystemVariable>(ref => ref)
    this.idStorage = new DataStorage<string, SystemVariable>(id => id)
  }

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    if (variable instanceof ReferrableVariable) {
      this.refStorage.delete(variable.ref)
    }
  }

  getVariableByRef(ref: string) {
    return this.refStorage.get(ref)
  }

  getVariableById(id: string) {
    return this.idStorage.get(id)
  }

  setVariable(variable: SystemVariable) {
    if (variable instanceof ReferrableVariable) {
      this.refStorage.set(variable.ref, variable)
    }
    this.idStorage.set(variable.id, variable)
  }

  loadConfig(config: VariableStorageConfig) {
    config.variables.forEach(variableConfig => {
      const variable = createVariableFromConfig(variableConfig)
      if (variable) {
        if (variable instanceof ReferrableVariable) {
          this.refStorage.set(variable.ref, variable)
        }
        this.idStorage.set(variable.id, variable)
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
