import * as z from 'zod'
import { SceneObjectInfo, sceneObjectReferenceSchema } from './SceneObjectInfo'
import {
  CameraObjectInfo,
  cameraObjectReferenceSchema,
} from './camera/CameraObjectInfo'
import {
  AnimationObjectInfo,
  animationObjectReferenceSchema,
} from './AnimationObjectInfo'
import { MeshObjectInfo, meshObjectReferenceSchema } from './MeshObjectInfo'
import { LightObjectInfo, lightObjectReferenceSchema } from './LightObjectInfo'
import { GroupObjectInfo } from './GroupObjectInfo'
export * from './ObjectInfo'
export * from './ObjectInSceneInfo'
export * from './SceneObjectInfo'
export * from './camera/CameraObjectInfo'
export * from './AnimationObjectInfo'
export * from './MeshObjectInfo'
export * from './LightObjectInfo'
export * from './GroupObjectInfo'
export * from './camera'

export * from './ObjectInfoManager'

export type SystemObjectInfo =
  | SceneObjectInfo
  | CameraObjectInfo
  | AnimationObjectInfo
  | LightObjectInfo
  | MeshObjectInfo
  | GroupObjectInfo

export type SystemObjectInSceneInfo =
  | LightObjectInfo
  | MeshObjectInfo
  | GroupObjectInfo

export type ObjectType = SystemObjectInfo['reference']['type']
export const objectReferenceSchema = z.union([
  sceneObjectReferenceSchema,
  cameraObjectReferenceSchema,
  animationObjectReferenceSchema,
  lightObjectReferenceSchema,
  meshObjectReferenceSchema,
])
export type ObjectReference = z.infer<typeof objectReferenceSchema>
