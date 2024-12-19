import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import VariableConnector, {
  ObjectPath,
  variableConnectorConfigSchema,
} from './VariableConnector'
import VariableStorage from './VariableStorage'
import { ObjectReference } from '../object'

export const variableConnectorStorageConfigSchema = z.object({
  connectors: z.array(variableConnectorConfigSchema),
})
export type VariableConnectorStorageConfig = z.infer<
  typeof variableConnectorStorageConfigSchema
>

type PathStorageKey = {
  objectPath: ObjectPath
  objectReference: ObjectReference
}

class VariableConnectorStorage {
  private pathStorage: DataStorage<PathStorageKey, VariableConnector>

  constructor() {
    this.pathStorage = new DataStorage<PathStorageKey, VariableConnector>(
      key => JSON.stringify(key.objectReference) + key.objectPath.join('.')
    )
  }

  set(connector: VariableConnector) {
    this.pathStorage.set(
      {
        objectPath: connector.getObjectPath(),
        objectReference: connector.getObjectInfo().reference as ObjectReference,
      },
      connector
    )
  }

  loadConfig(
    config: VariableConnectorStorageConfig,
    objectInfoManager: ObjectInfoManager,
    variableStorage: VariableStorage
  ) {
    config.connectors.forEach(connector => {
      const variable = variableStorage.getVariableById(connector.variableId)
      const object = objectInfoManager.getObjectInfoByReference(
        connector.objectReference
      )
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
