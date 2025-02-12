import * as z from 'zod'
import { sceneObjectConfigSchema } from './SceneObjectInfo'
import { cameraObjectConfigSchema } from './camera/CameraObjectInfo'
import { animationObjectConfigSchema } from './AnimationObjectInfo'
import { meshObjectConfigSchema } from './MeshObjectInfo'
import { formulaObjectConfigSchema } from './FormulaObjectInfo'
import { lightObjectConfigSchema } from './light'
import { boneObjectConfigSchema } from './BoneObjectInfo'
import { sceneSwitcherObjectConfigSchema } from './SceneSwitcherObjectInfo'
import { cameraSwitcherObjectConfigSchema } from './CameraSwitcherObjectInfo'

export * from './SceneSwitcherObjectInfo'
export * from './CameraSwitcherObjectInfo'
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

export const objectConfigSchema = z.union([
  sceneObjectConfigSchema,
  cameraObjectConfigSchema,
  animationObjectConfigSchema,
  lightObjectConfigSchema,
  meshObjectConfigSchema,
  formulaObjectConfigSchema,
  boneObjectConfigSchema,
  sceneSwitcherObjectConfigSchema,
  cameraSwitcherObjectConfigSchema,
])
export type ObjectConfig = z.infer<typeof objectConfigSchema>
