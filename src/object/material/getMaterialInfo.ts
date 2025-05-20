import { MaterialObjectInfo } from './MaterialObjectInfo'
import { MaterialRouterObjectInfo } from './MaterialRouter'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { errorResponse, successResponse } from '../../utils'
import { z } from 'zod'

export const MaterialRouterObjectInfoIdsSchema = z.union([
  z.string().nullable(),
  z.array(z.string().nullable()),
])
export type MaterialInfo = MaterialObjectInfo | MaterialRouterObjectInfo
export type MeshMaterialInfo = MaterialInfo | MaterialInfo[]
export type MaterialRouterObjectInfoIds = z.infer<
  typeof MaterialRouterObjectInfoIdsSchema
>

export const getMeshMaterialInfo = (
  materialObjectInfos: MaterialObjectInfo | MaterialObjectInfo[],
  materialRouterObjectInfoIds: MaterialRouterObjectInfoIds,
  objectInfoStorage: ObjectInfoStorage
) => {
  if (
    !Array.isArray(materialObjectInfos) &&
    !Array.isArray(materialRouterObjectInfoIds)
  ) {
    if (materialRouterObjectInfoIds === null) {
      return successResponse(materialObjectInfos)
    }
    const materialRouterObjectInfo = objectInfoStorage.get(
      materialRouterObjectInfoIds
    )
    if (materialRouterObjectInfo instanceof MaterialRouterObjectInfo) {
      return successResponse<MeshMaterialInfo>(materialRouterObjectInfo)
    }
    return successResponse<MeshMaterialInfo>(materialObjectInfos)
  }

  if (
    Array.isArray(materialObjectInfos) &&
    Array.isArray(materialRouterObjectInfoIds) &&
    materialObjectInfos.length === materialRouterObjectInfoIds.length
  ) {
    const result: MeshMaterialInfo = []
    for (let i = 0; i < materialObjectInfos.length; i++) {
      const currentMaterialObjectInfo = materialObjectInfos[i]
      const currentMaterialRouterObjectInfoId = materialRouterObjectInfoIds[i]
      if (currentMaterialRouterObjectInfoId !== null) {
        const materialRouterObjectInfo = objectInfoStorage.get(
          currentMaterialRouterObjectInfoId
        )
        if (materialRouterObjectInfo instanceof MaterialRouterObjectInfo) {
          result.push(materialRouterObjectInfo)
          continue
        }
      }
      result.push(currentMaterialObjectInfo)
    }
    return successResponse(result)
  }

  return errorResponse(
    'INCOMPATIBLE_MATERIAL_AND_MATERIAL_ROUTER_IDS',
    'material and MaterialRouterObjectInfoIds must be the same length'
  )
}
