import * as z from 'zod'
import { CameraObjectInfo, ObjectInfoManager, SceneObjectInfo } from './object'
import Switcher from './utils/Switcher'
import VariableConnectorManager, {
  VariableConnectorManagerConfigSchema,
} from './variable/VariableConnectorManager'
import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import { GLTFLoadResult } from './loader'

export const threeSceneStudioManagerConfigSchema = z.object({
  variableConnectorManagerConfig: VariableConnectorManagerConfigSchema,
  variableManagerConfig: variableManagerConfigSchema,
})
export type ThreeSceneStudioManagerConfig = z.infer<
  typeof threeSceneStudioManagerConfigSchema
>

export class ThreeSceneStudioManager {
  readonly objectInfoManager: ObjectInfoManager
  readonly cameraSwitcher: Switcher<CameraObjectInfo>
  readonly sceneSwitcher: Switcher<SceneObjectInfo>
  readonly variableConnectorManager: VariableConnectorManager
  readonly variableManager: VariableManager

  constructor() {
    this.objectInfoManager = new ObjectInfoManager()

    const cameras = this.objectInfoManager.getObjectInfos('OBJECT_3D_CAMERA')
    this.cameraSwitcher = new Switcher(cameras)

    const scenes = this.objectInfoManager.getObjectInfos('OBJECT_3D_SCENE')
    this.sceneSwitcher = new Switcher(scenes)

    this.variableManager = new VariableManager()
    this.variableConnectorManager = new VariableConnectorManager(
      this.objectInfoManager,
      this.variableManager
    )
  }

  loadConfig(result: GLTFLoadResult, config: ThreeSceneStudioManagerConfig) {
    // implement load gltf
    this.variableConnectorManager.loadConfig(
      config.variableConnectorManagerConfig
    )
    this.variableManager.loadConfig(config.variableManagerConfig)
  }

  serialize() {
    return {
      variableConnectorManagerConfig: this.variableConnectorManager.serialize(),
      variableManagerConfig: this.variableManager.serialize(),
    }
  }
}
