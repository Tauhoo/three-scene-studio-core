import * as z from 'zod'
import { CameraObjectInfo, ObjectInfoManager, SceneObjectInfo } from './object'
import Switcher from './utils/Switcher'
import { v4 as uuidv4 } from 'uuid'
import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import {
  ContainerHeightVariable,
  ContainerWidthVariable,
  Variable,
} from './variable'
import Context from './utils/Context'
import Renderer from './Renderer'
import { ReferrableVariable } from './variable/ReferrableVariable'

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
  readonly variableManager: VariableManager<Variable>
  readonly referableVariableManager: VariableManager<ReferrableVariable>
  readonly renderer: Renderer
  readonly context: Context
  constructor(context: Context) {
    this.context = context
    this.objectInfoManager = new ObjectInfoManager()

    const cameras = this.objectInfoManager.getObjectInfos('OBJECT_3D_CAMERA')
    this.cameraSwitcher = new Switcher(cameras)

    const scenes = this.objectInfoManager.getObjectInfos('OBJECT_3D_SCENE')
    this.sceneSwitcher = new Switcher(scenes)

    this.renderer = new Renderer(
      context,
      this.cameraSwitcher,
      this.sceneSwitcher
    )

    this.variableManager = new VariableManager()
    this.referableVariableManager = new VariableManager()

    // setup system variables
    this.referableVariableManager.variableStorage.setVariable(
      new ContainerHeightVariable(context, 'CONTAINER_HEIGHT', 'ch', uuidv4())
    )
    this.referableVariableManager.variableStorage.setVariable(
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
