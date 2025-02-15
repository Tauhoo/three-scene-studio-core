import * as z from 'zod'
import { formulaVariableConfigSchema } from './formula/FormularVariable'
import { globalFormulaVariableConfigSchema } from './formula/GlobalFormulaVariable'
import { containerWidthVariableConfigSchema } from './ContainerWidthVariable'
import { containerHeightVariableConfigSchema } from './ContainerHeightVariable'
import { timeVariableConfigSchema } from './TimeVariable'

export * from './VariableConnector'
export * from './VariableConnectorStorage'
export * from './VariableManager'
export * from './VariableStorage'

// variables
export * from './ExternalVariable'
export * from './ContainerWidthVariable'
export * from './ContainerHeightVariable'
export * from './formula'

export * from './ReferrableVariable'
export * from './Variable'

export * from './types'

export const variableConfigSchema = z.union([
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
  timeVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
])
export type VariableConfig = z.infer<typeof variableConfigSchema>
