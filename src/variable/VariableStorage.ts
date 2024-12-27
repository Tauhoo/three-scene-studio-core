import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import {
  createVariableFromConfig,
  SystemReferrableVariable,
  variableConfigSchema,
  VariableGroup,
} from '.'
import { ReferrableVariable } from './ReferrableVariable'
import { Variable } from './Variable'
import Context from '../utils/Context'

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

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    if (variable instanceof ReferrableVariable) {
      this.refStorage.delete(variable.ref)
    }
  }

  searchVariable(search: string, group: VariableGroup | null = null) {
    return this.idStorage.getAll().filter(variable => {
      if (!(variable instanceof ReferrableVariable)) return false
      if (variable.group === group || group === null) {
        if (variable.ref.includes(search)) {
          return true
        }
        if (variable.name.includes(search)) {
          return true
        }
        return false
      } else {
        return false
      }
    })
  }

  getVariableByRef(ref: string) {
    return this.refStorage.get(ref)
  }

  getVariableById(id: string) {
    return this.idStorage.get(id)
  }

  getAllVariables() {
    return this.idStorage.getAll()
  }

  setVariable(variable: SystemReferrableVariable) {
    if (variable instanceof ReferrableVariable) {
      this.refStorage.set(variable.ref, variable)
    }
    this.idStorage.set(variable.id, variable)
  }

  loadConfig(context: Context, config: VariableStorageConfig) {
    config.variables.forEach(variableConfig => {
      const variable = createVariableFromConfig(context, variableConfig)
      if (variable !== null) {
        if (variable instanceof ReferrableVariable) {
          this.refStorage.set(variable.ref, variable)
        }
        this.idStorage.set(variable.id, variable)
      }
    })
  }

  serialize(): VariableStorageConfig {
    const variables = this.idStorage
      .getAll()
      .filter(
        variable => variable.group !== 'SYSTEM'
      ) as SystemReferrableVariable[]
    return {
      variables: variables.map(variable => variable.serialize()),
    }
  }
}

export default VariableStorage
