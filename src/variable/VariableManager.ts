import * as z from 'zod'
import VariableStorage, { variableStorageConfigSchema } from './VariableStorage'
import VariableConnectorStorage, {
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import { FormulaObjectInfo, ObjectInfoManager } from '../object'
import Context from '../utils/Context'
import {
  ContainerHeightVariable,
  ContainerWidthVariable,
  ExternalVariable,
  FormulaVariable,
  GlobalFormulaVariable,
} from '.'
import { TimeVariable } from './TimeVariable'
import { Clock } from '../Clock'
import { parseExpression } from '../utils'

export const variableManagerConfigSchema = z.object({
  variableStorage: variableStorageConfigSchema,
  variableConnectorStorage: variableConnectorStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

class VariableManager {
  readonly variableStorage
  readonly variableConnectorStorage
  private objectInfoManager: ObjectInfoManager
  private context: Context
  private clock: Clock

  constructor(
    objectInfoManager: ObjectInfoManager,
    context: Context,
    clock: Clock
  ) {
    this.variableConnectorStorage = new VariableConnectorStorage()
    this.variableStorage = new VariableStorage(this.variableConnectorStorage)
    this.objectInfoManager = objectInfoManager
    this.context = context
    this.clock = clock
  }

  // Variable initializers

  createFormulaVariable(formula: string, id?: string): FormulaVariable {
    const parsedResult = parseExpression(formula)
    if (parsedResult.status === 'ERROR') {
      throw new Error(parsedResult.error)
    }
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo(
        parsedResult.data
      )
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
    const parsedResult = parseExpression(formula)
    if (parsedResult.status === 'ERROR') {
      throw new Error(parsedResult.error)
    }
    const formulaObjectInfo =
      this.objectInfoManager.objectInfoStorage.createFormulaObjectInfo(
        parsedResult.data
      )
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
    value: number,
    ref: string,
    id?: string
  ): ExternalVariable {
    const variable = new ExternalVariable(
      name,
      value,
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
    objectInfoManager: ObjectInfoManager
  ) {
    this.variableStorage.loadConfig(objectInfoManager, config.variableStorage)
    this.variableConnectorStorage.loadConfig(
      config.variableConnectorStorage,
      objectInfoManager,
      this.variableStorage
    )
  }

  serialize(): VariableManagerConfig {
    return {
      variableStorage: this.variableStorage.serialize(),
      variableConnectorStorage: this.variableConnectorStorage.serialize(),
    }
  }
}

export default VariableManager
