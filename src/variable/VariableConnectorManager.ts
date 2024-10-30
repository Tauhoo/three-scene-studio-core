import { ObjectInfos } from '../object'
import ObjectInfo from '../object/ObjectInfo'
import ObjectInfoManager from '../object/ObjectInfoManager'
import Variable from './Variable'
import VariableConnector, { ObjectPath } from './VariableConnector'
import VariableConnectorStorage from './VariableConnectorStorage'
import VariableManager from './VariableManager'
import Variables from './variables'

type VariableConnectorManagerConfig = ReturnType<
  VariableConnectorManager['serialize']
>

class VariableConnectorManager {
  private variableConnectorStorage: VariableConnectorStorage
  private objectInfoManager: ObjectInfoManager
  private variableManager: VariableManager

  constructor(
    objectInfoManager: ObjectInfoManager,
    variableManager: VariableManager,
    config: VariableConnectorManagerConfig
  ) {
    this.objectInfoManager = objectInfoManager
    this.variableManager = variableManager
    this.variableConnectorStorage = new VariableConnectorStorage(
      objectInfoManager,
      variableManager,
      config.variableConnectorStorage
    )
  }

  connect(variable: Variables, object: ObjectInfos, objectPath: ObjectPath) {
    const connector = new VariableConnector(variable, object, objectPath)
    this.variableConnectorStorage.set(connector.id, connector)
    return connector
  }

  destroy(id: string) {
    this.variableConnectorStorage.delete(id)
  }

  serialize() {
    return {
      variableConnectorStorage: this.variableConnectorStorage.serialize(),
    }
  }
}

export default VariableConnectorManager
