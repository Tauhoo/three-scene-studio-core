import { z } from 'zod'
import {
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
} from './formula'
import { containerWidthVariableConfigSchema } from './ContainerWidthVariable'
import { containerHeightVariableConfigSchema } from './ContainerHeightVariable'
import { timeVariableConfigSchema } from './TimeVariable'

export const variableConfigSchema = z.union([
  formulaVariableConfigSchema,
  globalFormulaVariableConfigSchema,
  timeVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
])

export type VariableConfig = z.infer<typeof variableConfigSchema>
