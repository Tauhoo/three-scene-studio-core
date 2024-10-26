import { CameraObjectInfo, SceneObjectInfo } from './object'
import ObjectInfoManager from './object/ObjectInfoManager'
import Switcher from './utils/Switcher'

class ThreeSceneManager {
  objectInfoManager: ObjectInfoManager
  cameraSwitcher: Switcher<CameraObjectInfo>
  sceneSwitcher: Switcher<SceneObjectInfo>

  constructor(objectInfoManager: ObjectInfoManager) {
    this.objectInfoManager = objectInfoManager
    const { gltfCameras, addedCameras } =
      objectInfoManager.getAllCameraObjectInfos()
    this.cameraSwitcher = new Switcher([...gltfCameras, ...addedCameras])
    this.sceneSwitcher = new Switcher(
      objectInfoManager.getAllSceneObjectInfos()
    )
  }
}

export default ThreeSceneManager
