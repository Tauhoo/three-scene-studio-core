import { CameraObjectInfo, SceneObjectInfo } from './object'
import ObjectInfoManager from './object/ObjectInfoManager'
import Switcher from './utils/Switcher'
import VariableConnectorManager from './variable/VariableConnectorManager'
import VariableManager from './variable/VariableManager'

type ThreeSceneStudioManagerConfig = ReturnType<
  ThreeSceneStudioManager['serialize']
>

interface ThreeSceneStudioManagerOptions {
  objectInfoManager: ObjectInfoManager
  config: ThreeSceneStudioManagerConfig
}

class ThreeSceneStudioManager {
  readonly objectInfoManager: ObjectInfoManager
  readonly cameraSwitcher: Switcher<CameraObjectInfo>
  readonly sceneSwitcher: Switcher<SceneObjectInfo>
  readonly variableConnectorManager: VariableConnectorManager
  readonly variableManager: VariableManager

  constructor(options: ThreeSceneStudioManagerOptions) {
    this.objectInfoManager = options.objectInfoManager

    const cameras = this.objectInfoManager.getObjectInfos('OBJECT_3D_CAMERA')
    this.cameraSwitcher = new Switcher(cameras)

    const scenes = this.objectInfoManager.getObjectInfos('OBJECT_3D_SCENE')
    this.sceneSwitcher = new Switcher(scenes)

    this.variableManager = new VariableManager(options.config.variableManager)
    this.variableConnectorManager = new VariableConnectorManager(
      this.objectInfoManager,
      this.variableManager,
      options.config.variableConnectorManager
    )
  }

  serialize() {
    return {
      variableConnectorManager: this.variableConnectorManager.serialize(),
      variableManager: this.variableManager.serialize(),
    }
  }
}

export default ThreeSceneStudioManager
