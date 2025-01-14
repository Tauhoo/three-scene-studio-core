import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import VariableConnector, {
  variableConnectorConfigSchema,
} from './VariableConnector'
import VariableStorage from './VariableStorage'
import { ReferrableVariable } from './ReferrableVariable'
import { Variable } from './Variable'
import { ObjectInfo, ObjectPath } from '../object'

export const variableConnectorStorageConfigSchema = z.object({
  connectors: z.array(variableConnectorConfigSchema),
})
export type VariableConnectorStorageConfig = z.infer<
  typeof variableConnectorStorageConfigSchema
>

type PathStorageKey = {
  objectPath: ObjectPath
  objectId: string
}

class VariableConnectorStorage {
  private pathStorage: DataStorage<PathStorageKey, VariableConnector>

  constructor() {
    this.pathStorage = new DataStorage<PathStorageKey, VariableConnector>(
      key => key.objectId + '.' + key.objectPath.join('.')
    )
  }

  delete(objectId: string, objectPath: ObjectPath) {
    this.pathStorage.delete({
      objectPath,
      objectId,
    })
  }

  get(objectId: string, objectPath: ObjectPath) {
    return this.pathStorage.get({
      objectPath,
      objectId,
    })
  }

  set(connector: VariableConnector) {
    this.pathStorage.set(
      {
        objectPath: connector.getObjectPath(),
        objectId: connector.getObjectInfo().config.id,
      },
      connector
    )
  }

  connectVariableToObjectInfo(
    variable: Variable,
    objectInfo: ObjectInfo,
    objectPath: ObjectPath
  ) {
    const connector = new VariableConnector(variable, objectInfo, objectPath)
    this.set(connector)
    return connector
  }

  deleteVariableConnectors(id: string) {
    for (const connector of this.pathStorage.getAll()) {
      if (connector.getVariable().id === id) {
        this.pathStorage.delete({
          objectPath: connector.getObjectPath(),
          objectId: id,
        })
      }
    }
  }

  loadConfig(
    config: VariableConnectorStorageConfig,
    objectInfoManager: ObjectInfoManager,
    variableStorage: VariableStorage
  ) {
    config.connectors.forEach(connector => {
      const variable = variableStorage.getVariableById(connector.variableId)
      const object = objectInfoManager.objectInfoStorage.get(connector.objectId)
      const objectPath = connector.objectPath
      if (variable === null || object === null) {
        return
      }
      this.set(new VariableConnector(variable, object, objectPath))
    })
  }

  serialize(): VariableConnectorStorageConfig {
    return {
      connectors: this.pathStorage
        .getAll()
        .map(connector => connector.serialize()),
    }
  }
}

export default VariableConnectorStorage
