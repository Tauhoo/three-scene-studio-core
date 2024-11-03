import * as z from 'zod'
import { SceneObjectInfo, sceneObjectReferenceSchema } from './SceneObjectInfo'
import {
  CameraObjectInfo,
  cameraObjectReferenceSchema,
} from './CameraObjectInfo'
import {
  AnimationObjectInfo,
  animationObjectReferenceSchema,
} from './AnimationObjectInfo'
import { MeshObjectInfo, meshObjectReferenceSchema } from './MeshObjectInfo'
import { LightObjectInfo, lightObjectReferenceSchema } from './LightObjectInfo'

export * from './SceneObjectInfo'
export * from './CameraObjectInfo'
export * from './AnimationObjectInfo'
export * from './MeshObjectInfo'
export * from './LightObjectInfo'

export * from './ObjectInfoManager'

export type ObjectInfo =
  | SceneObjectInfo
  | CameraObjectInfo
  | AnimationObjectInfo
  | LightObjectInfo
  | MeshObjectInfo
export type ObjectType = ObjectInfo['reference']['type']
export const objectReferenceSchema = z.union([
  sceneObjectReferenceSchema,
  cameraObjectReferenceSchema,
  animationObjectReferenceSchema,
  lightObjectReferenceSchema,
  meshObjectReferenceSchema,
])
export type ObjectReference = z.infer<typeof objectReferenceSchema>
