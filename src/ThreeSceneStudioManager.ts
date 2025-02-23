import * as z from 'zod'
import {
  CameraObjectInfo,
  ObjectInfo,
  ObjectInfoManager,
  objectInfoManagerConfigSchema,
  SceneObjectInfo,
} from './object'
import Switcher from './utils/Switcher'
import {
  VariableManager,
  variableManagerConfigSchema,
} from './variable/VariableManager'
import Context from './utils/Context'
import Renderer from './Renderer'
import { Clock } from './Clock'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Loader } from './loader'

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

  constructor(context?: Context) {
    if (context) {
      this.context = context
    } else {
      if (typeof window !== 'undefined') {
        this.context = new Context(window)
      } else {
        throw new Error('window is undefined')
      }
    }

    this.objectInfoManager = new ObjectInfoManager()

    this.objectInfoManager.objectInfoStorage.addListener(
      'ADD',
      this.onObjectInfoAdded
    )
    this.objectInfoManager.objectInfoStorage.addListener(
      'DELETE',
      this.onObjectInfoRemoved
    )

    this.clock = new Clock(this.context)
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
    this.variableManager.createContainerHeightVariable('CONTAINER_HEIGHT', 'ch')
    this.variableManager.createContainerWidthVariable('CONTAINER_WIDTH', 'cw')
    this.variableManager.createTimeVariable('TIME', 't')

    // setup renderer
    this.renderer = new Renderer(
      this.context,
      this.cameraSwitcher,
      this.sceneSwitcher,
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

  private onObjectInfoRemoved = (objectInfo: ObjectInfo) => {
    if (objectInfo instanceof CameraObjectInfo) {
      this.cameraSwitcher.remove(objectInfo)
    } else if (objectInfo instanceof SceneObjectInfo) {
      this.sceneSwitcher.remove(objectInfo)
    }
  }

  async loadWorkFromURL(url: string) {
    const loader = new Loader(this)
    await loader.loadGLTFByURL(url)
  }

  loadConfig(gltf: GLTF, config: ThreeSceneStudioManagerConfig) {
    this.objectInfoManager.loadConfig(
      gltf,
      this.cameraSwitcher,
      this.sceneSwitcher,
      config.objectInfoManager
    )
    this.variableManager.loadConfig(config.variableManager, this)
  }

  serialize(): ThreeSceneStudioManagerConfig {
    return {
      variableManager: this.variableManager.serialize(),
      objectInfoManager: this.objectInfoManager.serialize(),
    }
  }

  destroy() {
    this.objectInfoManager.objectInfoStorage.removeListener(
      'ADD',
      this.onObjectInfoAdded
    )
    this.objectInfoManager.objectInfoStorage.removeListener(
      'DELETE',
      this.onObjectInfoRemoved
    )
    this.renderer.destroy()
    this.variableManager.destroy()
    this.objectInfoManager.destroy()
    this.clock.destroy()
    this.context.destroy()
  }
}
