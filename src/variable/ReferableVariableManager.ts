import VariableManager from './VariableManager'
import ReferableVariableStorage from './ReferableVariableStorage'

class ReferableVariableManager extends VariableManager {
  readonly variableStorage = new ReferableVariableStorage()
}

export default ReferableVariableManager
