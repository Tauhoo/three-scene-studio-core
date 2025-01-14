import * as z from 'zod'
import VariableStorage, { variableStorageConfigSchema } from './VariableStorage'
import VariableConnectorStorage, {
  variableConnectorStorageConfigSchema,
} from './VariableConnectorStorage'
import {
  FormulaObjectInfo,
  ObjectInfo,
  ObjectInfoManager,
  ObjectPath,
} from '../object'
import Context from '../utils/Context'
import {
  ContainerHeightVariable,
  ContainerWidthVariable,
  ExternalVariable,
  FormulaVariable,
  GlobalFormulaVariable,
  Variable,
  VariableConfig,
} from '.'
import { TimeVariable } from './TimeVariable'
import { Clock } from '../Clock'
import { parseExpression } from '../utils'
import VariableConnector from './VariableConnector'

export const variableManagerConfigSchema = z.object({
  variableStorageConfig: variableStorageConfigSchema,
  variableConnectorStorageConfig: variableConnectorStorageConfigSchema,
})

export type VariableManagerConfig = z.infer<typeof variableManagerConfigSchema>

class VariableManager {
  readonly variableStorage = new VariableStorage()
  readonly variableConnectorStorage = new VariableConnectorStorage()
  private objectInfoManager: ObjectInfoManager
  private context: Context
  private clock: Clock

  constructor(
    objectInfoManager: ObjectInfoManager,
    context: Context,
    clock: Clock
  ) {
    this.objectInfoManager = objectInfoManager
    this.context = context
    this.clock = clock
  }

  // Variable initializers

  createFormulaVariable(
    formulaObjectInfo: FormulaObjectInfo,
    id?: string
  ): FormulaVariable {
    const variable = new FormulaVariable(formulaObjectInfo, id)
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
    const formulaObjectInfo = new FormulaObjectInfo(
      this,
      parsedResult.data,
      ref
    )
    this.objectInfoManager.objectInfoStorage.setObjectInfo(formulaObjectInfo)
    const variable = new GlobalFormulaVariable(ref, formulaObjectInfo, name, id)
    this.variableStorage.setVariable(variable)
    return variable
  }

  createContainerHeightVariable(
    name: string,
    ref: string,
    id?: string
  ): ContainerHeightVariable {
    const variable = new ContainerHeightVariable(this.context, name, ref, id)
    this.variableStorage.setVariable(variable)
    return variable
  }

  createContainerWidthVariable(
    name: string,
    ref: string,
    id?: string
  ): ContainerWidthVariable {
    const variable = new ContainerWidthVariable(this.context, name, ref, id)
    this.variableStorage.setVariable(variable)
    return variable
  }

  createExternalVariable(
    name: string,
    value: number,
    ref: string,
    id?: string
  ): ExternalVariable {
    const variable = new ExternalVariable(name, value, ref, id)
    this.variableStorage.setVariable(variable)
    return variable
  }

  createTimeVariable(name: string, ref: string, id?: string): TimeVariable {
    const variable = new TimeVariable(this.clock, name, ref, id)
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
    this.variableStorage.loadConfig(
      objectInfoManager,
      config.variableStorageConfig
    )
    this.variableConnectorStorage.loadConfig(
      config.variableConnectorStorageConfig,
      objectInfoManager,
      this.variableStorage
    )
  }

  serialize(): VariableManagerConfig {
    return {
      variableStorageConfig: this.variableStorage.serialize(),
      variableConnectorStorageConfig: this.variableConnectorStorage.serialize(),
    }
  }
}

export default VariableManager
