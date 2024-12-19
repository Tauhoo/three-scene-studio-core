import * as z from 'zod'
import { CameraObjectInfo, ObjectInfoManager, SceneObjectInfo } from './object'
import Switcher from './utils/Switcher'

import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import { GLTFLoadResult } from './loader'

export const threeSceneStudioManagerConfigSchema = z.object({
  variableManagerConfig: variableManagerConfigSchema,
  referableVariableManagerConfig: variableManagerConfigSchema,
})
export type ThreeSceneStudioManagerConfig = z.infer<
  typeof threeSceneStudioManagerConfigSchema
>

export class ThreeSceneStudioManager {
  readonly objectInfoManager: ObjectInfoManager
  readonly cameraSwitcher: Switcher<CameraObjectInfo>
  readonly sceneSwitcher: Switcher<SceneObjectInfo>
  readonly variableManager: VariableManager
  readonly referableVariableManager: VariableManager

  constructor() {
    this.objectInfoManager = new ObjectInfoManager()

    const cameras = this.objectInfoManager.getObjectInfos('OBJECT_3D_CAMERA')
    this.cameraSwitcher = new Switcher(cameras)

    const scenes = this.objectInfoManager.getObjectInfos('OBJECT_3D_SCENE')
    this.sceneSwitcher = new Switcher(scenes)

    this.variableManager = new VariableManager()
    this.referableVariableManager = new VariableManager()
  }

  loadConfig(result: GLTFLoadResult, config: ThreeSceneStudioManagerConfig) {
    // implement load gltf
    this.variableManager.loadConfig(
      config.variableManagerConfig,
      this.objectInfoManager
    )
    this.referableVariableManager.loadConfig(
      config.referableVariableManagerConfig,
      this.objectInfoManager
    )
  }

  serialize() {
    return {
      variableManagerConfig: this.variableManager.serialize(),
      referableVariableManagerConfig: this.referableVariableManager.serialize(),
    }
  }
}
