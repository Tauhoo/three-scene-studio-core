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
import { parse, predictNodeValueType } from '../utils'

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
    clock: Clock
  ) {
    this.variableConnectorStorage = new VariableConnectorStorage()
    this.variableStorage = new VariableStorage(
      this.variableConnectorStorage,
      objectInfoManager
    )
    this.objectInfoManager = objectInfoManager
    this.context = context
    this.clock = clock
  }

  // Variable initializers

  createFormulaVariable(formula: string, id?: string): FormulaVariable {
    const parsedResult = parse(formula)
    if (parsedResult.status === 'ERROR') {
      throw new Error(parsedResult.error)
    }
    const predictResult = predictNodeValueType(parsedResult.data, name => {
      const variable = this.variableStorage.getVariableById(name)
      if (variable === null) {
        return null
      }
      return variable.value.valueType
    })
    if (predictResult.status === 'FAIL') {
      throw new Error(predictResult.error)
    }
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo({
        text: formula,
        node: parsedResult.data,
        valueType: predictResult.info.value,
      })
    const variable = new FormulaVariable(
      formulaObjectInfo,
      this.objectInfoManager,
      this.variableConnectorStorage,
      this.variableStorage,
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
  }

  createGlobalFormulaVariable(
    ref: string,
    formula: string,
    name: string,
    id?: string
  ): GlobalFormulaVariable {
    const parsedResult = parse(formula)
    if (parsedResult.status === 'ERROR') {
      throw new Error(parsedResult.error)
    }
    const predictResult = predictNodeValueType(parsedResult.data, name => {
      const variable = this.variableStorage.getVariableById(name)
      if (variable === null) {
        return null
      }
      return variable.value.valueType
    })
    if (predictResult.status === 'FAIL') {
      throw new Error(predictResult.error)
    }
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo({
        text: formula,
        node: parsedResult.data,
        valueType: predictResult.info.value,
      })
    this.objectInfoManager.objectInfoStorage.setObjectInfo(formulaObjectInfo)
    const variable = new GlobalFormulaVariable(
      this.variableStorage.convertToNoneDuplicateRef(ref),
      formulaObjectInfo,
      name,
      this.objectInfoManager,
      this.variableConnectorStorage,
      this.variableStorage,
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
  }

  createContainerHeightVariable(
    name: string,
    ref: string,
    id?: string
  ): ContainerHeightVariable {
    const variable = new ContainerHeightVariable(
      this.context,
      name,
      this.variableStorage.convertToNoneDuplicateRef(ref),
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
  }

  createContainerWidthVariable(
    name: string,
    ref: string,
    id?: string
  ): ContainerWidthVariable {
    const variable = new ContainerWidthVariable(
      this.context,
      name,
      this.variableStorage.convertToNoneDuplicateRef(ref),
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
  }

  createExternalVariable(
    name: string,
    value: number | number[],
    ref: string,
    id?: string
  ): ExternalVariable {
    const variable = new ExternalVariable(
      name,
      typeof value === 'number'
        ? { valueType: 'NUMBER', value }
        : { valueType: 'VECTOR', value },
      this.variableStorage.convertToNoneDuplicateRef(ref),
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
  }

  createTimeVariable(name: string, ref: string, id?: string): TimeVariable {
    const variable = new TimeVariable(
      this.clock,
      name,
      this.variableStorage.convertToNoneDuplicateRef(ref),
      id
    )
    this.variableStorage.setVariable(variable)
    return variable
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
