import ObjectInfoManager from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import VariableConnector from './VariableConnector'

class VariableConnectorStorage extends DataStorage<string, VariableConnector> {
  private objectInfoManager: ObjectInfoManager
  constructor(objectInfoManager: ObjectInfoManager) {
    super(id => id)
    this.objectInfoManager = objectInfoManager
  }

  serialize() {
    return { connectors: this.getAll().map(connector => connector.serialize()) }
  }
}

export default VariableConnectorStorage
