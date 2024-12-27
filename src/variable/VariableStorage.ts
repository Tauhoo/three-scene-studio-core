import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import {
  createVariableFromConfig,
  VariableConfig,
  variableConfigSchema,
  VariableGroup,
} from '.'
import { Variable } from './Variable'
import Context from '../utils/Context'
import { ReferrableVariable } from './ReferrableVariable'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

export const variableStorageConfigSchema = z.object({
  variables: z.array(variableConfigSchema),
})

export type VariableStorageConfig = z.infer<typeof variableStorageConfigSchema>

export type VariableStorageEvent<T extends Variable | ReferrableVariable> =
  | EventPacket<
      'SET_VARIABLE',
      {
        variable: T
      }
    >
  | EventPacket<
      'DELETE_VARIABLE',
      {
        variable: T
      }
    >

class VariableStorage<
  T extends Variable | ReferrableVariable
> extends EventDispatcher<VariableStorageEvent<T>> {
  private refStorage: DataStorage<string, Variable>
  private idStorage: DataStorage<string, Variable>

  constructor() {
    super()
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
    this.dispatch('DELETE_VARIABLE', {
      variable,
    })
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
    }) as T[]
  }

  getVariableByRef(ref: string) {
    return this.refStorage.get(ref) as T | null
  }

  getVariableById(id: string) {
    return this.idStorage.get(id) as T | null
  }

  getAllVariables() {
    return this.idStorage.getAll() as T[]
  }

  setVariable(variable: T) {
    if (variable instanceof ReferrableVariable) {
      this.refStorage.set(variable.ref, variable)
    }
    this.idStorage.set(variable.id, variable)
    this.dispatch('SET_VARIABLE', {
      variable,
    })
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
    return {
      variables: this.idStorage
        .getAll()
        .filter(variable => variable.group !== 'SYSTEM')
        .map(variable => variable.serialize() as VariableConfig),
    }
  }
}

export default VariableStorage
