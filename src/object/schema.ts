import * as z from 'zod'
import { sceneObjectConfigSchema } from './SceneObjectInfo'
import { cameraObjectConfigSchema } from './camera/CameraObjectInfo'
import { meshObjectConfigSchema } from './MeshObjectInfo'
import { lightObjectConfigSchema } from './light'
import { boneObjectConfigSchema } from './BoneObjectInfo'
import { sceneSwitcherObjectConfigSchema } from './SceneSwitcherObjectInfo'
import { cameraSwitcherObjectConfigSchema } from './CameraSwitcherObjectInfo'

export const inSceneObjectInfoConfigSchema = z.union([
  sceneObjectConfigSchema,
  cameraObjectConfigSchema,
  lightObjectConfigSchema,
  meshObjectConfigSchema,
  boneObjectConfigSchema,
])

export type InSceneObjectInfoConfig = z.infer<
  typeof inSceneObjectInfoConfigSchema
>

export const uniqueObjectInfoConfigSchema = z.object({
  sceneSwitcher: sceneSwitcherObjectConfigSchema,
  cameraSwitcher: cameraSwitcherObjectConfigSchema,
})

export type UniqueObjectInfoConfig = z.infer<
  typeof uniqueObjectInfoConfigSchema
>
