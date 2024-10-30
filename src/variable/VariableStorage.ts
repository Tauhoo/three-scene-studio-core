import DataStorage from '../utils/DataStorage'
import Variables from './variables'

type VariableStorageConfig = ReturnType<VariableStorage['serialize']>

class VariableStorage extends DataStorage<string, Variables> {
  constructor(config: VariableStorageConfig) {
    super(id => id)
  }

  serialize() {
    return { variables: this.getAll().map(variable => variable.serialize()) }
  }
}

export default VariableStorage
