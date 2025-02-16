import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import { Variable } from './Variable'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { FormulaObjectInfo } from '../object'
import { VariableConnectorStorage } from './VariableConnectorStorage'
import { convertToNoneDuplicateRef } from '../utils/naming'
import { TimeVariable } from './TimeVariable'
import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'
import { VariableConfig, variableConfigSchema } from './schema'
import { ReferrableVariable } from './ReferrableVariable'
import { VariableGroup } from './types'
import { FormulaVariable, GlobalFormulaVariable } from './formula'
import { ContainerWidthVariable } from './ContainerWidthVariable'
import { ContainerHeightVariable } from './ContainerHeightVariable'

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

export class VariableStorage extends EventDispatcher<VariableStorageEvent> {
  protected idStorage: DataStorage<string, Variable>
  private refStorage: DataStorage<string, ReferrableVariable>
  private variableConnectorStorage: VariableConnectorStorage
  private systemVariables: DataStorage<string, Variable>

  constructor(variableConnectorStorage: VariableConnectorStorage) {
    super()
    this.idStorage = new DataStorage<string, Variable>(id => id)
    this.refStorage = new DataStorage<string, ReferrableVariable>(ref => ref)
    this.systemVariables = new DataStorage<string, Variable>(id => id)
    this.variableConnectorStorage = variableConnectorStorage
  }

  convertToNoneDuplicateRef(ref: string) {
    const refList = this.refStorage.getAll().map(variable => variable.ref)
    return convertToNoneDuplicateRef(ref, refList)
  }

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    if (variable instanceof ReferrableVariable) {
      this.refStorage.delete(variable.ref)
    }
    if (variable.group === 'SYSTEM') {
      this.systemVariables.delete(variable.type)
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

  getAllReferrableVariables() {
    return this.refStorage.getAll()
  }

  setVariable(variable: Variable) {
    if (variable.group === 'SYSTEM') {
      const systemVariable = this.systemVariables.get(variable.type)
      if (systemVariable !== null) {
        this.deleteVariableById(systemVariable.id)
      }
      this.systemVariables.set(variable.type, variable)
    }
    this.idStorage.set(variable.id, variable)
    if (variable instanceof ReferrableVariable) {
      this.refStorage.set(variable.ref, variable)
    }
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
    threeSceneStudioManager: ThreeSceneStudioManager,
    config: VariableConfig
  ): Variable | null {
    const { objectInfoManager, clock, context } = threeSceneStudioManager
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
          this,
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
          this,
          config.id
        )
      }
      case 'TIME': {
        return new TimeVariable(clock, config.name, config.ref, config.id)
      }
      case 'CONTAINER_WIDTH': {
        return new ContainerWidthVariable(
          context,
          config.name,
          config.ref,
          config.id
        )
      }
      case 'CONTAINER_HEIGHT': {
        return new ContainerHeightVariable(
          context,
          config.name,
          config.ref,
          config.id
        )
      }
    }
  }

  loadConfig(
    threeSceneStudioManager: ThreeSceneStudioManager,
    config: VariableStorageConfig
  ) {
    config.variables.forEach(variableConfig => {
      const variable = this.createVariableFromConfig(
        threeSceneStudioManager,
        variableConfig
      )
      if (variable instanceof Variable) {
        this.setVariable(variable)
      }
    })
  }

  serialize(): VariableStorageConfig {
    return {
      variables: this.idStorage
        .getAll()
        .map(variable => variable.serialize() as VariableConfig),
    }
  }
}
