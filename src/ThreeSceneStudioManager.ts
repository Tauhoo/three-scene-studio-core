import * as z from 'zod'
import {
  CameraObjectInfo,
  ObjectInfo,
  ObjectInfoManager,
  SceneObjectInfo,
} from './object'
import Switcher from './utils/Switcher'
import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import Context from './utils/Context'
import Renderer from './Renderer'
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
  readonly variableManager: VariableManager
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
    this.clock = new Clock()
    this.variableManager = new VariableManager(
      this.objectInfoManager,
      this.context,
      this.clock
    )

    // setup system variables
    const containerHeightVariable =
      this.variableManager.createContainerHeightVariable(
        'CONTAINER_HEIGHT',
        'ch'
      )
    const containerWidthVariable =
      this.variableManager.createContainerWidthVariable('CONTAINER_WIDTH', 'cw')
    this.variableManager.createTimeVariable('TIME', 't')
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
      config.variableManagerConfig,
      this.objectInfoManager
    )
  }

  serialize() {
    return {
      variableManagerConfig: this.variableManager.serialize(),
    }
  }
}
