import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import {
  FormulaVariable,
  GlobalFormulaVariable,
  ReferrableVariable,
  VariableConfig,
  variableConfigSchema,
  VariableGroup,
} from '.'
import { Variable } from './Variable'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { FormulaObjectInfo, ObjectInfoManager } from '../object'
import VariableConnectorStorage from './VariableConnectorStorage'

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
  private refStorage: DataStorage<string, ReferrableVariable>
  private variableConnectorStorage: VariableConnectorStorage

  constructor(variableConnectorStorage: VariableConnectorStorage) {
    super()
    this.idStorage = new DataStorage<string, Variable>(id => id)
    this.refStorage = new DataStorage<string, ReferrableVariable>(ref => ref)
    this.variableConnectorStorage = variableConnectorStorage
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

  searchVariable(search: string, group: VariableGroup | null = null) {
    return this.refStorage.getAll().filter(variable => {
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

  private createVariableFromConfig(
    objectInfoManager: ObjectInfoManager,
    config: VariableConfig
  ): Variable | null {
    switch (config.type) {
      case 'FORMULA':
        const formulaObject = objectInfoManager.objectInfoStorage.get(
          config.formulaObjectInfoId
        )
        if (!(formulaObject instanceof FormulaObjectInfo)) {
          return null
        }
        return new FormulaVariable(
          formulaObject,
          objectInfoManager,
          this.variableConnectorStorage,
          config.id
        )
      case 'GLOBAL_FORMULA': {
        const formulaObject = objectInfoManager.objectInfoStorage.get(
          config.formulaObjectInfoId
        )
        if (!(formulaObject instanceof FormulaObjectInfo)) {
          return null
        }
        return new GlobalFormulaVariable(
          config.ref,
          formulaObject,
          config.name,
          objectInfoManager,
          this.variableConnectorStorage,
          config.id
        )
      }
    }
  }

  loadConfig(
    objectInfoManager: ObjectInfoManager,
    config: VariableStorageConfig
  ) {
    config.variables.forEach(variableConfig => {
      const variable = this.createVariableFromConfig(
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
