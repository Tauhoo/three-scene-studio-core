import * as z from 'zod'
import { VariableStorage, variableStorageConfigSchema } from './VariableStorage'
import {
  VariableConnectorStorage,
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import { ObjectInfoManager } from '../object'
import Context from '../utils/Context'
import { TimeVariable } from './TimeVariable'
import { Clock } from '../Clock'
import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'
import { FormulaVariable, GlobalFormulaVariable } from './formula'
import { ContainerHeightVariable } from './ContainerHeightVariable'
import { ContainerWidthVariable } from './ContainerWidthVariable'
import { ExternalVariable } from './ExternalVariable'
import NameManager from '../NameManager'
import { successResponse } from '../utils'

export const variableManagerConfigSchema = z.object({
  variableStorage: variableStorageConfigSchema,
  variableConnectorStorage: variableConnectorStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

export class VariableManager {
  readonly variableStorage: VariableStorage
  readonly variableConnectorStorage: VariableConnectorStorage
  private objectInfoManager: ObjectInfoManager
  private context: Context
  private clock: Clock

  constructor(
    objectInfoManager: ObjectInfoManager,
    context: Context,
    clock: Clock,
    nameManager: NameManager
  ) {
    this.variableConnectorStorage = new VariableConnectorStorage()
    this.variableStorage = new VariableStorage(
      this.variableConnectorStorage,
      nameManager
    )
    this.objectInfoManager = objectInfoManager
    this.context = context
    this.clock = clock
  }

  createFormulaVariable(formula: string, id?: string) {
    const variable = new FormulaVariable(
      formula,
      this.objectInfoManager,
      this.variableConnectorStorage,
      this.variableStorage,
      id
    )
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  createGlobalFormulaVariable(
    ref: string,
    formula: string,
    name: string,
    id?: string
  ) {
    const variable = new GlobalFormulaVariable(
      ref,
      name,
      formula,
      this.objectInfoManager,
      this.variableConnectorStorage,
      this.variableStorage,
      id
    )
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  createContainerHeightVariable(name: string, ref: string, id?: string) {
    const variable = new ContainerHeightVariable(this.context, name, ref, id)
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  createContainerWidthVariable(name: string, ref: string, id?: string) {
    const variable = new ContainerWidthVariable(this.context, name, ref, id)
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  createExternalVariable(
    name: string,
    value: number | number[],
    ref: string,
    id?: string
  ) {
    const variable = new ExternalVariable(
      name,
      typeof value === 'number'
        ? { valueType: 'NUMBER', value }
        : { valueType: 'VECTOR', value },
      ref,
      id
    )
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  createTimeVariable(name: string, ref: string, id?: string) {
    const variable = new TimeVariable(this.clock, name, ref, id)
    const result = this.variableStorage.setVariable(variable)
    if (result.status === 'ERROR') {
      variable.destroy()
      return result
    }
    return successResponse(variable)
  }

  deleteVariable(id: string) {
    const variable = this.variableStorage.getVariableById(id)
    if (variable === null) return
    this.variableConnectorStorage.deleteVariableConnectors(variable.id)
    variable.destroy()
    this.variableStorage.deleteVariableById(id)
  }

  loadConfig(
    config: VariableManagerConfig,
    threeSceneStudioManager: ThreeSceneStudioManager
  ) {
    this.variableStorage.loadConfig(
      threeSceneStudioManager,
      config.variableStorage
    )
    this.variableConnectorStorage.loadConfig(
      config.variableConnectorStorage,
      threeSceneStudioManager.objectInfoManager,
      this.variableStorage
    )
  }

  serialize(): VariableManagerConfig {
    return {
      variableStorage: this.variableStorage.serialize(),
      variableConnectorStorage: this.variableConnectorStorage.serialize(),
    }
  }

  destroy() {
    this.variableStorage.destroy()
  }
}
