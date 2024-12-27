import * as z from 'zod'
import {
  ContainerHeightVariable,
  containerHeightVariableConfigSchema,
} from './ContainerHeightVariable'
import {
  ContainerWidthVariable,
  containerWidthVariableConfigSchema,
} from './ContainerWidthVariable'
import {
  ExternalVariable,
  externalVariableConfigSchema,
} from './ExternalVariable'
import { parseExpression } from '../utils/expression'
import {
  FormulaVariable,
  formulaVariableConfigSchema,
} from './FormularVariable'
import Context from '../utils/Context'
import {
  GlobalFormulaVariable,
  globalFormulaVariableConfigSchema,
} from './GlobalFormulaVariable'
import { Variable } from './Variable'

export * from './VariableConnector'
export * from './VariableConnectorStorage'
export * from './VariableManager'
export * from './VariableStorage'

// variables
export * from './ExternalVariable'
export * from './ContainerWidthVariable'
export * from './ContainerHeightVariable'

export * from './Variable'

export type SystemVariable =
  | ExternalVariable
  | ContainerWidthVariable
  | ContainerHeightVariable
  | FormulaVariable
  | GlobalFormulaVariable
export type VariableType = SystemVariable['type']

export type SystemReferrableVariable =
  | ExternalVariable
  | ContainerWidthVariable
  | ContainerHeightVariable
  | GlobalFormulaVariable
export type ReferrableVariableType = SystemReferrableVariable['type']

export type VariableGroup = SystemVariable['group']

export const variableConfigSchema = z.union([
  externalVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
])
export type VariableConfig = z.infer<typeof variableConfigSchema>

export const referableVariableConfigSchema = z.union([
  externalVariableConfigSchema,
  globalFormulaVariableConfigSchema,
])
export type ReferrableVariableConfig = z.infer<
  typeof referableVariableConfigSchema
>

export function createVariableFromConfig(
  context: Context,
  config: VariableConfig
): Variable | null {
  switch (config.type) {
    case 'EXTERNAL':
      return new ExternalVariable(
        config.name,
        config.value,
        config.ref,
        config.id
      )
    case 'CONTAINER_WIDTH':
      return new ContainerWidthVariable(
        context,
        config.name,
        config.ref,
        config.id
      )
    case 'CONTAINER_HEIGHT':
      return new ContainerHeightVariable(
        context,
        config.name,
        config.ref,
        config.id
      )
    case 'FORMULA':
      const formula = parseExpression(config.formula)
      if (formula.status === 'ERROR') {
        return null
      }
      return new FormulaVariable(formula.data, config.id)
    case 'GLOBAL_FORMULA': {
      const formula = parseExpression(config.formula)
      if (formula.status === 'ERROR') {
        return null
      }
      return new GlobalFormulaVariable(
        config.ref,
        formula.data,
        config.name,
        config.id
      )
    }
  }
}
