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
import { ReferrableVariable } from './ReferrableVariable'

export * from './VariableConnector'
export * from './VariableConnectorStorage'
export * from './VariableManager'
export * from './VariableStorage'

// variables
export * from './ExternalVariable'
export * from './ContainerWidthVariable'
export * from './ContainerHeightVariable'
export * from './FormularVariable'
export * from './GlobalFormulaVariable'

export * from './Variable'
export * from './types'

export const variableConfigSchema = z.union([
  externalVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
])
export type VariableConfig = z.infer<typeof variableConfigSchema>

export const referrableVariableConfigSchema = z.union([
  externalVariableConfigSchema,
  globalFormulaVariableConfigSchema,
])
export type ReferrableVariableConfig = z.infer<
  typeof referrableVariableConfigSchema
>

export type VariableType = ReferrableVariableConfig['type']
export type ReferrableVariableType = ReferrableVariableConfig['type']

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

export function createDefaultVariable(
  type: ReferrableVariableType,
  name: string,
  ref: string
): ReferrableVariable | null {
  switch (type) {
    case 'EXTERNAL':
      return new ExternalVariable(name, 0, ref)
    case 'GLOBAL_FORMULA': {
      const formula = parseExpression('0')
      if (formula.status === 'ERROR') {
        return null
      }
      return new GlobalFormulaVariable(ref, formula.data, name)
    }
  }
}
