import ContainerHeightVariable from './ContainerHeightVariable'
import ContainerWidthVariable from './ContainerWidthVariable'
import ExternalVariable from './ExternalVariable'

type Variables =
  | ExternalVariable
  | ContainerWidthVariable
  | ContainerHeightVariable
export type VariableType = Variables['type']
export default Variables
