import * as z from 'zod'
import { formulaVariableConfigSchema } from './formula/FormularVariable'
import { globalFormulaVariableConfigSchema } from './formula/GlobalFormulaVariable'

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
])
export type VariableConfig = z.infer<typeof variableConfigSchema>
