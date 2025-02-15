import * as z from 'zod'
import {
  CameraObjectInfo,
  ObjectInfo,
  ObjectInfoManager,
  objectInfoManagerConfigSchema,
  SceneObjectInfo,
} from './object'
import Switcher from './utils/Switcher'
import VariableManager, {
  variableManagerConfigSchema,
} from './variable/VariableManager'
import Context from './utils/Context'
import Renderer from './Renderer'
import { Clock } from './Clock'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const threeSceneStudioManagerConfigSchema = z.object({
  variableManager: variableManagerConfigSchema,
  objectInfoManager: objectInfoManagerConfigSchema,
})
export type ThreeSceneStudioManagerConfig = z.infer<
  typeof threeSceneStudioManagerConfigSchema
>

export class ThreeSceneStudioManager {
  // config loadable
  readonly objectInfoManager: ObjectInfoManager
  readonly variableManager: VariableManager

  readonly cameraSwitcher: Switcher<CameraObjectInfo> = new Switcher(
    'Camera switcher',
    []
  )
  readonly sceneSwitcher: Switcher<SceneObjectInfo> = new Switcher(
    'Scene switcher',
    []
  )
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

    this.clock = new Clock(context)
    this.variableManager = new VariableManager(
      this.objectInfoManager,
      this.context,
      this.clock
    )

    // setup system object infos
    this.objectInfoManager.objectInfoStorage.createSceneSwitcherObjectInfo(
      this.sceneSwitcher
    )
    this.objectInfoManager.objectInfoStorage.createCameraSwitcherObjectInfo(
      this.cameraSwitcher
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

    // setup renderer
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

  loadConfig(gltf: GLTF, config: ThreeSceneStudioManagerConfig) {
    this.objectInfoManager.loadConfig(
      gltf,
      this.cameraSwitcher,
      this.sceneSwitcher,
      config.objectInfoManager
    )
    this.variableManager.loadConfig(
      config.variableManager,
      this.objectInfoManager
    )
  }

  serialize(): ThreeSceneStudioManagerConfig {
    return {
      variableManager: this.variableManager.serialize(),
      objectInfoManager: this.objectInfoManager.serialize(),
    }
  }
}
