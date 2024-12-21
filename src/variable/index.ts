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

export * from './VariableConnector'
export * from './VariableConnectorStorage'
export * from './VariableManager'
export * from './VariableStorage'

// variables
export * from './ExternalVariable'
export * from './ContainerWidthVariable'
export * from './ContainerHeightVariable'

export type Variable =
  | ExternalVariable
  | ContainerWidthVariable
  | ContainerHeightVariable
  | FormulaVariable
export type VariableType = Variable['type']

export const variableConfigSchema = z.union([
  externalVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
  formulaVariableConfigSchema,
])
export type VariableConfig = z.infer<typeof variableConfigSchema>

export function createVariableFromConfig(
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
        config.name,
        config.value,
        config.ref,
        config.id
      )
    case 'CONTAINER_HEIGHT':
      return new ContainerHeightVariable(
        config.name,
        config.value,
        config.ref,
        config.id
      )
    case 'FORMULA':
      const formula = parseExpression(config.formula)
      if (formula.status === 'ERROR') {
        return null
      }
      return new FormulaVariable(formula.data, config.id)
  }
}
