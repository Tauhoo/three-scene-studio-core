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

export * from './VariableConnector'
export * from './VariableConnectorManager'
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
export type VariableType = Variable['type']

export const variableConfigSchema = z.union([
  externalVariableConfigSchema,
  containerWidthVariableConfigSchema,
  containerHeightVariableConfigSchema,
])
export type VariableConfig = z.infer<typeof variableConfigSchema>

export function createVariableFromConfig(config: VariableConfig): Variable {
  switch (config.type) {
    case 'EXTERNAL':
      return new ExternalVariable(
        config.id,
        config.name,
        config.value,
        config.ref
      )
    case 'CONTAINER_WIDTH':
      return new ContainerWidthVariable(
        config.id,
        config.name,
        config.value,
        config.ref
      )
    case 'CONTAINER_HEIGHT':
      return new ContainerHeightVariable(
        config.id,
        config.name,
        config.value,
        config.ref
      )
  }
}
