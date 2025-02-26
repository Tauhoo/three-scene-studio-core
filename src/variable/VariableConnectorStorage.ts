import * as z from 'zod'
import { ObjectInfoManager } from '../object/ObjectInfoManager'
import DataStorage from '../utils/DataStorage'
import {
  VariableConnector,
  variableConnectorConfigSchema,
} from './VariableConnector'
import { VariableStorage } from './VariableStorage'
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

export class VariableConnectorStorage {
  private pathStorage: DataStorage<PathStorageKey, VariableConnector>
  private objectInfoIdStorage: DataStorage<string, VariableConnector[]>

  constructor() {
    this.pathStorage = new DataStorage<PathStorageKey, VariableConnector>(
      key => key.objectId + '.' + key.objectPath.join('.')
    )
    this.objectInfoIdStorage = new DataStorage(key => key)
  }

  delete(objectId: string, objectPath: ObjectPath) {
    const connector = this.get(objectId, objectPath)
    if (connector === null) return
    this.pathStorage.delete({
      objectPath,
      objectId,
    })
    const connectors = this.objectInfoIdStorage.get(objectId)
    if (connectors !== null) {
      const newConnectors = connectors.filter(
        c => c.getObjectPath().join('.') !== objectPath.join('.')
      )
      this.objectInfoIdStorage.set(objectId, newConnectors)
    }
    connector.destroy()
  }

  get(objectId: string, objectPath: ObjectPath) {
    return this.pathStorage.get({
      objectPath,
      objectId,
    })
  }

  getByObjectInfoId(objectId: string) {
    return this.objectInfoIdStorage.get(objectId)
  }

  set(connector: VariableConnector) {
    this.delete(connector.getObjectInfo().config.id, connector.getObjectPath())
    this.pathStorage.set(
      {
        objectPath: connector.getObjectPath(),
        objectId: connector.getObjectInfo().config.id,
      },
      connector
    )
    const connectors = this.objectInfoIdStorage.get(
      connector.getObjectInfo().config.id
    )
    if (connectors !== null) {
      this.objectInfoIdStorage.set(connector.getObjectInfo().config.id, [
        ...connectors,
        connector,
      ])
    }
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

  deleteVariableConnectors(variableId: string) {
    for (const connector of this.pathStorage.getAll()) {
      if (connector.getVariable().id === variableId) {
        connector.destroy()
        this.delete(
          connector.getObjectInfo().config.id,
          connector.getObjectPath()
        )
      }
    }
  }

  deleteObjectConnectors(objectId: string) {
    for (const connector of this.pathStorage.getAll()) {
      const objectInfo = connector.getObjectInfo()
      if (objectInfo.config.id === objectId) {
        this.delete(objectInfo.config.id, connector.getObjectPath())
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
