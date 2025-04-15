import * as z from 'zod'
import DataStorage from '../utils/DataStorage'
import { Variable } from './Variable'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { FormulaObjectInfo, ObjectInfoManager } from '../object'
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
import {
  errorResponse,
  parse,
  predictNodeValueType,
  successResponse,
} from '../utils'
import NameManager from '../NameManager'

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
  private nameManager: NameManager

  constructor(
    variableConnectorStorage: VariableConnectorStorage,
    nameManager: NameManager
  ) {
    super()
    this.idStorage = new DataStorage<string, Variable>(id => id)
    this.refStorage = new DataStorage<string, ReferrableVariable>(ref => ref)
    this.systemVariables = new DataStorage<string, Variable>(id => id)
    this.variableConnectorStorage = variableConnectorStorage
    this.nameManager = nameManager
  }

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    if (variable instanceof ReferrableVariable) {
      this.nameManager.removeRef(variable.ref)
      this.refStorage.delete(variable.ref)
    }
    if (variable.group === 'SYSTEM') {
      this.systemVariables.delete(variable.type)
    }
    this.variableConnectorStorage.deleteVariableConnectors(variable.id)
    variable.destroy()
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
    if (
      variable instanceof ReferrableVariable &&
      this.nameManager.hasRef(variable.ref)
    ) {
      return errorResponse('DUPLICATE_REF', 'Duplicate ref')
    }
    if (variable.group === 'SYSTEM') {
      const systemVariable = this.systemVariables.get(variable.type)
      if (systemVariable !== null) {
        this.deleteVariableById(systemVariable.id)
      }
      this.systemVariables.set(variable.type, variable)
    }
    this.idStorage.set(variable.id, variable)
    if (variable instanceof ReferrableVariable) {
      this.nameManager.addRef(variable.ref)
      this.refStorage.set(variable.ref, variable)
    }
    this.dispatch('SET_VARIABLE', {
      variable,
    })
    return successResponse(null)
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
  ) {
    const { objectInfoManager, clock, context } = threeSceneStudioManager
    switch (config.type) {
      case 'FORMULA':
        return successResponse(
          new FormulaVariable(
            config.formula,
            objectInfoManager,
            this.variableConnectorStorage,
            this,
            config.id
          )
        )
      case 'GLOBAL_FORMULA': {
        if (threeSceneStudioManager.nameManager.hasRef(config.ref)) {
          return errorResponse('DUPLICATE_REF', 'Duplicate ref')
        }
        return successResponse(
          new GlobalFormulaVariable(
            config.ref,
            config.name,
            config.formula,
            objectInfoManager,
            this.variableConnectorStorage,
            this,
            config.id
          )
        )
      }
      case 'TIME': {
        if (threeSceneStudioManager.nameManager.hasRef(config.ref)) {
          return errorResponse('DUPLICATE_REF', 'Duplicate ref')
        }
        return successResponse(
          new TimeVariable(clock, config.name, config.ref, config.id)
        )
      }
      case 'CONTAINER_WIDTH': {
        if (threeSceneStudioManager.nameManager.hasRef(config.ref)) {
          return errorResponse('DUPLICATE_REF', 'Duplicate ref')
        }
        return successResponse(
          new ContainerWidthVariable(
            context,
            config.name,
            config.ref,
            config.id
          )
        )
      }
      case 'CONTAINER_HEIGHT': {
        if (threeSceneStudioManager.nameManager.hasRef(config.ref)) {
          return errorResponse('DUPLICATE_REF', 'Duplicate ref')
        }
        return successResponse(
          new ContainerHeightVariable(
            context,
            config.name,
            config.ref,
            config.id
          )
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

  destroy() {
    for (const variable of this.getAllVariables()) {
      this.deleteVariableById(variable.id)
    }
  }
}
