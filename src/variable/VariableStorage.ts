import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import {
  createVariableFromConfig,
  VariableConfig,
  variableConfigSchema,
} from '.'
import { Variable } from './Variable'
import Context from '../utils/Context'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { ObjectInfoManager } from '../object'

export const variableStorageConfigSchema = z.object({
  variables: z.array(variableConfigSchema),
})

export type VariableStorageConfig = z.infer<typeof variableStorageConfigSchema>

export type VariableStorageEvent =
  | EventPacket<
      'SET_VARIABLE',
      {
        variable: Variable
      }
    >
  | EventPacket<
      'DELETE_VARIABLE',
      {
        variable: Variable
      }
    >

class VariableStorage extends EventDispatcher<VariableStorageEvent> {
  protected idStorage: DataStorage<string, Variable>

  constructor() {
    super()
    this.idStorage = new DataStorage<string, Variable>(id => id)
  }

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    this.dispatch('DELETE_VARIABLE', {
      variable,
    })
  }

  getVariableById(id: string) {
    return this.idStorage.get(id)
  }

  getAllVariables() {
    return this.idStorage.getAll()
  }

  setVariable(variable: Variable) {
    this.idStorage.set(variable.id, variable)
    this.dispatch('SET_VARIABLE', {
      variable,
    })
  }

  loadConfig(
    context: Context,
    objectInfoManager: ObjectInfoManager,
    config: VariableStorageConfig
  ) {
    config.variables.forEach(variableConfig => {
      const variable = createVariableFromConfig(
        context,
        objectInfoManager,
        variableConfig
      )
      if (variable instanceof Variable) {
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
