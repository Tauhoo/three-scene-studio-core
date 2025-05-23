import {
  InSceneObjectInfo,
  inSceneObjectInfoConfigSchema,
  InSceneObjectInfoEvent,
} from './InSceneObjectInfo'
import {
  getMeshMaterialInfo,
  MaterialRouterObjectInfoIdsSchema,
  MeshMaterialInfo,
} from './material/getMaterialInfo'
import * as THREE from 'three'
import z from 'zod'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import { getMaterialObjectInfos } from './material/getMeshMaterialObject'
import { MaterialRouterObjectInfo } from './material/MaterialRouter'
import { ObjectInfo } from './ObjectInfo'
import { MaterialObjectInfo } from './material/MaterialObjectInfo'
import { defaultMaterial } from './material/constant'
import { EventPacket } from '../utils'
import EventDispatcher from '../utils/EventDispatcher'

export const materialOwnerObjectConfigSchema =
  inSceneObjectInfoConfigSchema.extend({
    materialRouterObjectInfoIds: MaterialRouterObjectInfoIdsSchema,
  })

export type MaterialOwnerObjectConfig = z.infer<
  typeof materialOwnerObjectConfigSchema
>
export type MaterialRouterObjectInfoIds =
  MaterialOwnerObjectConfig['materialRouterObjectInfoIds']

export type MaterialOwnerObjectInfoEvent =
  | InSceneObjectInfoEvent
  | EventPacket<'MATERIAL_CHANGED', { material: MeshMaterialInfo }>

export abstract class MaterialOwnerObjectInfo extends InSceneObjectInfo {
  abstract readonly config: MaterialOwnerObjectConfig
  abstract readonly data: THREE.Mesh
  material: MeshMaterialInfo
  abstract eventDispatcher: EventDispatcher<MaterialOwnerObjectInfoEvent>

  constructor(
    data: THREE.Mesh,
    sceneId: string,
    materialRouterObjectInfoIds: MaterialRouterObjectInfoIds,
    objectInfoStorage: ObjectInfoStorage,
    id: string
  ) {
    super(data, id, sceneId, objectInfoStorage)

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
  }

  getMaterialRouterObjectInfoIds = () => {
    if (Array.isArray(this.material)) {
      return this.material.map(value =>
        value.data === defaultMaterial ? null : value.config.id
      )
    }

    if (this.material.data === defaultMaterial) {
      return null
    }

    return this.material.config.id
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
    this.eventDispatcher.dispatch('MATERIAL_CHANGED', {
      material: this.material,
    })
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
    super.destroy()
  }
}
