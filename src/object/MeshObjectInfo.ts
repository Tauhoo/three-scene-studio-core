import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ObjectInfo, ObjectPath } from './ObjectInfo'
import { SystemValueType } from '../utils'
import { getMaterialObjectInfos } from './material/getMeshMaterialObject'
import {
  getMeshMaterialInfo,
  MeshMaterialInfo,
  MaterialRouterObjectInfoIdsSchema,
} from './material/getMaterialInfo'
import { MaterialRouterObjectInfo } from './material/MaterialRouter'
import { MaterialObjectInfo } from './material/MaterialObjectInfo'

export const meshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_MESH'),
  id: z.string(),
  sceneId: z.string(),
  materialRouterObjectInfoIds: MaterialRouterObjectInfoIdsSchema,
})

export type MeshObjectConfig = z.infer<typeof meshObjectConfigSchema>
export type MaterialRouterObjectInfoIds =
  MeshObjectConfig['materialRouterObjectInfoIds']

export class MeshObjectInfo extends InSceneObjectInfo {
  readonly config: MeshObjectConfig
  readonly data: THREE.Mesh
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null
  material: MeshMaterialInfo

  constructor(
    data: THREE.Mesh,
    sceneId: string,
    materialRouterObjectInfoIds: MaterialRouterObjectInfoIds,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, sceneId, objectInfoStorage)

    const materialObjectInfos = getMaterialObjectInfos(data, objectInfoStorage)
    const meshMaterialInfoResult = getMeshMaterialInfo(
      materialObjectInfos,
      materialRouterObjectInfoIds,
      objectInfoStorage
    )

    let newMaterialRouterObjectInfoIds: MaterialRouterObjectInfoIds
    if (meshMaterialInfoResult.status === 'ERROR') {
      newMaterialRouterObjectInfoIds = Array.isArray(materialObjectInfos)
        ? Array(materialObjectInfos.length).fill(null)
        : null
      this.material = materialObjectInfos
    } else {
      if (Array.isArray(meshMaterialInfoResult.data)) {
        newMaterialRouterObjectInfoIds = meshMaterialInfoResult.data.map(
          material =>
            material instanceof MaterialRouterObjectInfo
              ? material.config.id
              : null
        )
      } else {
        newMaterialRouterObjectInfoIds =
          meshMaterialInfoResult.data instanceof MaterialRouterObjectInfo
            ? meshMaterialInfoResult.data.config.id
            : null
      }
      this.material = meshMaterialInfoResult.data
    }
    this.registerMaterialEvent()

    this.config = {
      type: 'OBJECT_3D_MESH',
      id: actualId,
      sceneId,
      materialRouterObjectInfoIds: newMaterialRouterObjectInfoIds,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }

  setValue(objectPath: ObjectPath, value: any, valueType?: SystemValueType) {
    const result = super.setValue(objectPath, value, valueType)
    if (this.boxHelper !== null) {
      this.boxHelper.update()
    }
    return result
  }

  helper(value: boolean) {
    if (value) {
      if (this.boxHelper === null && this.data.parent !== null) {
        this.boxHelper = new THREE.BoxHelper(this.data)
        this.boxHelper.update()
        this.data.traverseAncestors(object => {
          if (object instanceof THREE.Scene && this.boxHelper !== null) {
            object.add(this.boxHelper)
          }
        })
      }
    } else {
      if (this.boxHelper !== null && this.boxHelper.parent !== null) {
        this.boxHelper.parent.remove(this.boxHelper)
        this.boxHelper = null
      }
    }
    super.helper(value)
  }

  onMaterialDestroyed = (objectInfo: ObjectInfo) => {
    this.unregisterMaterialEvent()
    const materialObjectInfo =
      this.objectInfoStorage.getDefaultStandardMaterialObjectInfo()
    if (Array.isArray(this.material)) {
      for (let i = 0; i < this.material.length; i++) {
        if (this.material[i] === objectInfo) {
          this.material[i] = materialObjectInfo
          if (Array.isArray(this.config.materialRouterObjectInfoIds)) {
            this.config.materialRouterObjectInfoIds[i] = null
          }
        }
      }
      this.data.material = this.material.map(material =>
        material.data instanceof THREE.Material
          ? material.data
          : materialObjectInfo.data
      )
    }

    if (objectInfo === this.material) {
      this.material = materialObjectInfo
      this.data.material = materialObjectInfo.data
      this.config.materialRouterObjectInfoIds = null
    }
    this.registerMaterialEvent()
  }

  private registerMaterialEvent() {
    if (Array.isArray(this.material)) {
      for (const material of this.material) {
        if (material instanceof MaterialRouterObjectInfo) {
          material.eventDispatcher.addListener(
            'DESTROY',
            this.onMaterialDestroyed
          )
        }
        if (material instanceof MaterialObjectInfo) {
          material.eventDispatcher.addListener(
            'DESTROY',
            this.onMaterialDestroyed
          )
        }
      }
    } else {
      if (this.material instanceof MaterialRouterObjectInfo) {
        this.material.eventDispatcher.addListener(
          'DESTROY',
          this.onMaterialDestroyed
        )
      }
      if (this.material instanceof MaterialObjectInfo) {
        this.material.eventDispatcher.addListener(
          'DESTROY',
          this.onMaterialDestroyed
        )
      }
    }
  }

  private unregisterMaterialEvent() {
    if (Array.isArray(this.material)) {
      for (const material of this.material) {
        if (material instanceof MaterialRouterObjectInfo) {
          material.eventDispatcher.removeListener(
            'DESTROY',
            this.onMaterialDestroyed
          )
        }
        if (material instanceof MaterialObjectInfo) {
          material.eventDispatcher.removeListener(
            'DESTROY',
            this.onMaterialDestroyed
          )
        }
      }
    } else {
      if (this.material instanceof MaterialRouterObjectInfo) {
        this.material.eventDispatcher.removeListener(
          'DESTROY',
          this.onMaterialDestroyed
        )
      }
      if (this.material instanceof MaterialObjectInfo) {
        this.material.eventDispatcher.removeListener(
          'DESTROY',
          this.onMaterialDestroyed
        )
      }
    }
  }

  destroy(): void {
    this.unregisterMaterialEvent()
    if (this.boxHelper) {
      this.helper(false)
    }
    this.data.geometry.dispose()
    if (Array.isArray(this.data.material)) {
      for (const material of this.data.material) {
        material.dispose()
      }
    } else {
      this.data.material.dispose()
    }
    super.destroy()
  }
}
