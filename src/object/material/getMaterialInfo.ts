import * as THREE from 'three'
import { MaterialObjectInfo } from './MaterialObjectInfo'
import MaterialRouter from './MaterialRouter/MaterialRouter'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { errorResponse, successResponse } from '../../utils'
import { z } from 'zod'

export const materialRouterIdsSchema = z.union([
  z.string().nullable(),
  z.array(z.string().nullable()),
])
export type MaterialInfo = MaterialObjectInfo | MaterialRouter
export type MeshMaterialInfo = MaterialInfo | MaterialInfo[]
export type MaterialRouterIds = z.infer<typeof materialRouterIdsSchema>

export const getMeshMaterialInfo = (
  materialObjectInfos: MaterialObjectInfo | MaterialObjectInfo[],
  materialRouterIds: MaterialRouterIds,
  objectInfoStorage: ObjectInfoStorage
) => {
  if (
    !Array.isArray(materialObjectInfos) &&
    !Array.isArray(materialRouterIds)
  ) {
    if (materialRouterIds === null) {
      return successResponse(materialObjectInfos)
    }
    const materialRouter = objectInfoStorage.get(materialRouterIds)
    if (materialRouter instanceof MaterialRouter) {
      return successResponse<MeshMaterialInfo>(materialRouter)
    }
    return successResponse<MeshMaterialInfo>(materialObjectInfos)
  }

  if (
    Array.isArray(materialObjectInfos) &&
    Array.isArray(materialRouterIds) &&
    materialObjectInfos.length === materialRouterIds.length
  ) {
    const result: MeshMaterialInfo = []
    for (let i = 0; i < materialObjectInfos.length; i++) {
      const currentMaterialObjectInfo = materialObjectInfos[i]
      const currentMaterialRouterId = materialRouterIds[i]
      if (currentMaterialRouterId !== null) {
        const materialRouter = objectInfoStorage.get(currentMaterialRouterId)
        if (materialRouter instanceof MaterialRouter) {
          result.push(materialRouter)
          continue
        }
      }
      result.push(currentMaterialObjectInfo)
    }
    return successResponse(result)
  }

  return errorResponse(
    'INCOMPATIBLE_MATERIAL_AND_MATERIAL_ROUTER_IDS',
    'material and materialRouterIds must be the same length'
  )
}
