import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { ObjectInfo, ObjectPath } from './ObjectInfo'
import { BoneObjectInfo } from './BoneObjectInfo'
import { SystemValueType } from '../utils'
import { MaterialRouterIds } from './MeshObjectInfo'
import { MeshMaterialInfo } from './material/getMaterialInfo'
import {
  getMeshMaterialInfo,
  materialRouterIdsSchema,
} from './material/getMaterialInfo'
import { getMaterialObjectInfos } from './material/getMeshMaterialObject'
import MaterialRouter from './material/MaterialRouter/MaterialRouter'

export const skinMeshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_SKIN_MESH'),
  id: z.string(),
  sceneId: z.string(),
  materialRouterIds: materialRouterIdsSchema,
})

export type SkinMeshObjectConfig = z.infer<typeof skinMeshObjectConfigSchema>

export type SkinMeshObjectInfoEvent =
  | EventPacket<'BONES_UPDATED', SkinMeshObjectInfo>
  | InSceneObjectInfoEvent
export class SkinMeshObjectInfo extends InSceneObjectInfo {
  readonly config: SkinMeshObjectConfig
  readonly data: THREE.SkinnedMesh
  readonly eventDispatcher: EventDispatcher<SkinMeshObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null
  readonly material: MeshMaterialInfo

  constructor(
    data: THREE.SkinnedMesh,
    sceneId: string,
    materialRouterIds: MaterialRouterIds,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, sceneId, objectInfoStorage)

    const materialObjectInfos = getMaterialObjectInfos(data, objectInfoStorage)
    const meshMaterialInfoResult = getMeshMaterialInfo(
      materialObjectInfos,
      materialRouterIds,
      objectInfoStorage
    )

    let newMaterialRouterIds: MaterialRouterIds
    if (meshMaterialInfoResult.status === 'ERROR') {
      newMaterialRouterIds = Array.isArray(materialObjectInfos)
        ? Array(materialObjectInfos.length).fill(null)
        : null
      this.material = materialObjectInfos
    } else {
      if (Array.isArray(meshMaterialInfoResult.data)) {
        newMaterialRouterIds = meshMaterialInfoResult.data.map(material =>
          material instanceof MaterialRouter ? material.config.id : null
        )
      } else {
        newMaterialRouterIds =
          meshMaterialInfoResult.data instanceof MaterialRouter
            ? meshMaterialInfoResult.data.config.id
            : null
      }
      this.material = meshMaterialInfoResult.data
    }

    this.config = {
      type: 'OBJECT_3D_SKIN_MESH',
      id: actualId,
      sceneId,
      materialRouterIds: newMaterialRouterIds,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
    this.objectInfoStorage.addListener('DELETE', this.onDelete)
  }

  onDelete = (objectInfo: ObjectInfo) => {
    if (!(objectInfo instanceof InSceneObjectInfo)) return
    const boneObjectSet: Set<THREE.Bone> = new Set()
    objectInfo.traverseChildren(child => {
      if (child instanceof BoneObjectInfo) {
        boneObjectSet.add(child.data)
      }
    })
    const startAmount = this.data.skeleton.bones.length
    this.data.skeleton.bones = this.data.skeleton.bones.filter(
      bone => !boneObjectSet.has(bone)
    )
    const endAmount = this.data.skeleton.bones.length
    if (startAmount !== endAmount) {
      this.data.skeleton.calculateInverses()
      this.eventDispatcher.dispatch('BONES_UPDATED', this)
    }
  }

  getBoneObjectInfos(): BoneObjectInfo[] {
    const boneObjectInfos: BoneObjectInfo[] = []
    const bones = new Set(this.data.skeleton.bones)
    for (const objectInfo of this.objectInfoStorage.getAll()) {
      if (objectInfo instanceof BoneObjectInfo) {
        if (bones.has(objectInfo.data)) {
          boneObjectInfos.push(objectInfo)
        }
      }
    }
    return boneObjectInfos
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

  destroy(): void {
    this.objectInfoStorage.removeListener('DELETE', this.onDelete)
    this.data.geometry.dispose()
    this.data.skeleton.dispose()
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
