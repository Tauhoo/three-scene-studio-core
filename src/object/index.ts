import * as z from 'zod'
import { SceneObjectInfo, sceneObjectConfigSchema } from './SceneObjectInfo'
import {
  CameraObjectInfo,
  cameraObjectConfigSchema,
} from './camera/CameraObjectInfo'
import {
  AnimationObjectInfo,
  animationObjectConfigSchema,
} from './AnimationObjectInfo'
import { MeshObjectInfo, meshObjectConfigSchema } from './MeshObjectInfo'
import { GroupObjectInfo } from './GroupObjectInfo'
import {
  formulaObjectConfigSchema,
  FormulaObjectInfo,
} from './FormulaObjectInfo'
import { lightObjectConfigSchema, LightObjectInfo } from './light'
import { SkinMeshObjectInfo } from './SkinMeshObjectInfo'
import { boneObjectConfigSchema } from './BoneObjectInfo'
import { BoneObjectInfo } from './BoneObjectInfo'
export * from './ObjectInfo'
export * from './InSceneObjectInfo'
export * from './SceneObjectInfo'
export * from './FormulaObjectInfo'
export * from './camera/CameraObjectInfo'
export * from './AnimationObjectInfo'
export * from './BoneObjectInfo'
export * from './MeshObjectInfo'
export * from './SkinMeshObjectInfo'
export * from './light'
export * from './GroupObjectInfo'
export * from './camera'

export * from './ObjectInfoManager'

export type SystemObjectInfo =
  | FormulaObjectInfo
  | SceneObjectInfo
  | CameraObjectInfo
  | AnimationObjectInfo
  | LightObjectInfo
  | MeshObjectInfo
  | GroupObjectInfo
  | SkinMeshObjectInfo
  | BoneObjectInfo
export type SystemObjectInSceneInfo =
  | LightObjectInfo
  | MeshObjectInfo
  | GroupObjectInfo
  | SkinMeshObjectInfo
  | BoneObjectInfo

export type ObjectType = SystemObjectInfo['config']['type']
export const objectConfigSchema = z.union([
  sceneObjectConfigSchema,
  cameraObjectConfigSchema,
  animationObjectConfigSchema,
  lightObjectConfigSchema,
  meshObjectConfigSchema,
  formulaObjectConfigSchema,
  boneObjectConfigSchema,
])
export type ObjectConfig = z.infer<typeof objectConfigSchema>
