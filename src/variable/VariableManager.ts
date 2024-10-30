import Variables from './variables'
import VariableStorage from './VariableStorage'

type VariableManagerConfig = ReturnType<VariableManager['serialize']>
class VariableManager {
  private variableStorage: VariableStorage

  constructor(config: VariableManagerConfig) {
    this.variableStorage = new VariableStorage(config.variableStorage)
  }

  addVariable(variable: Variables) {
    this.variableStorage.set(variable.id, variable)
  }

  getVariable(id: string) {
    return this.variableStorage.get(id)
  }

  getAllVariables() {
    return Object.values(this.variableStorage.getAll())
  }

  serialize() {
    return {
      variableStorage: this.variableStorage.serialize(),
    }
  }
}

export default VariableManager
