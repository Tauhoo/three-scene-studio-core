import * as z from 'zod'
import {
  CameraObjectInfo,
  ObjectInfo,
  ObjectInfoManager,
  SceneObjectInfo,
} from './object'
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
import { Clock } from './Clock'

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
  readonly clock: Clock

  constructor(context: Context) {
    this.context = context
    this.objectInfoManager = new ObjectInfoManager()

    this.objectInfoManager.addListener(
      'OBJECT_INFO_ADDED',
      this.onObjectInfoAdded
    )
    const cameras = this.objectInfoManager.getObjectInfos('OBJECT_3D_CAMERA')
    this.cameraSwitcher = new Switcher(cameras)

    const scenes = this.objectInfoManager.getObjectInfos('OBJECT_3D_SCENE')
    this.sceneSwitcher = new Switcher(scenes)

    this.variableManager = new VariableManager()
    this.referableVariableManager = new VariableManager()

    // setup system variables
    const containerHeightVariable = new ContainerHeightVariable(
      context,
      'CONTAINER_HEIGHT',
      'ch',
      uuidv4()
    )
    this.referableVariableManager.variableStorage.setVariable(
      containerHeightVariable
    )
    const containerWidthVariable = new ContainerWidthVariable(
      context,
      'CONTAINER_WIDTH',
      'cw',
      uuidv4()
    )
    this.referableVariableManager.variableStorage.setVariable(
      containerWidthVariable
    )

    this.clock = new Clock()
    this.renderer = new Renderer(
      context,
      this.cameraSwitcher,
      this.sceneSwitcher,
      containerHeightVariable,
      containerWidthVariable,
      this.clock
    )
  }

  private onObjectInfoAdded = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof CameraObjectInfo) {
      this.cameraSwitcher.add(objectInfo)
    } else if (objectInfo instanceof SceneObjectInfo) {
      this.sceneSwitcher.add(objectInfo)
    }
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
