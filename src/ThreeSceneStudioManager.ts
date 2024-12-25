import * as z from 'zod'
import { CameraObjectInfo, ObjectInfoManager, SceneObjectInfo } from './object'
import Switcher from './utils/Switcher'
import { v4 as uuidv4 } from 'uuid'
import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import { GLTFLoadResult } from './loader'
import { ContainerHeightVariable, ContainerWidthVariable } from './variable'
import Context from './utils/Context'

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

  setupSystemVariables(context: Context) {
    this.variableManager.variableStorage.setVariable(
      new ContainerHeightVariable(context, 'CONTAINER_HEIGHT', 'ch', uuidv4())
    )
    this.variableManager.variableStorage.setVariable(
      new ContainerWidthVariable(context, 'CONTAINER_WIDTH', 'cw', uuidv4())
    )
  }

  loadConfig(context: Context, config: ThreeSceneStudioManagerConfig) {
    // implement load gltf
    this.variableManager.loadConfig(
      context,
      config.variableManagerConfig,
      this.objectInfoManager
    )
    this.referableVariableManager.loadConfig(
      context,
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
