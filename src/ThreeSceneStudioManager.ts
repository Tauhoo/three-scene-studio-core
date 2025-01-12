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
import { ContainerHeightVariable, ContainerWidthVariable } from './variable'
import Context from './utils/Context'
import Renderer from './Renderer'
import { Clock } from './Clock'
import ReferableVariableManager from './variable/ReferableVariableManager'

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
  readonly referableVariableManager: ReferableVariableManager
  readonly renderer: Renderer
  readonly context: Context
  readonly clock: Clock

  constructor(context: Context) {
    this.context = context
    this.objectInfoManager = new ObjectInfoManager()

    this.objectInfoManager.objectInfoStorage.addListener(
      'ADD',
      this.onObjectInfoAdded
    )
    const cameras =
      this.objectInfoManager.objectInfoStorage.getCameraObjectInfos()
    this.cameraSwitcher = new Switcher(cameras)

    const scenes =
      this.objectInfoManager.objectInfoStorage.getSceneObjectInfos()
    this.sceneSwitcher = new Switcher(scenes)

    this.variableManager = new VariableManager()
    this.referableVariableManager = new ReferableVariableManager()

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
