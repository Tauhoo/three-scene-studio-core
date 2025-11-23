import { z } from 'zod'
import {
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
} from './formula'
import { containerWidthVariableConfigSchema } from './ContainerWidthVariable'
import { containerHeightVariableConfigSchema } from './ContainerHeightVariable'
import { timeVariableConfigSchema } from './TimeVariable'
import { externalVariableConfigSchema } from './ExternalVariable'

export const variableConfigSchema = z.union([
  externalVariableConfigSchema,
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
  timeVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
])

export type VariableConfig = z.infer<typeof variableConfigSchema>
