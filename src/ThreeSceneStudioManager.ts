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
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'

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

  async loadGLTFByURL(url: string) {
    const loader = new GLTFLoader()
    const result = await loader.loadAsync(url)
    this.loadGLTF(result)
  }

  loadGLTF(gltf: GLTF) {
    const config = gltf.userData['THREE_SCENE_STUDIO.CONFIG']
    const parsedConfig = threeSceneStudioManagerConfigSchema.safeParse(config)
    if (!parsedConfig.success) return
    this.loadConfig(gltf, parsedConfig.data)
  }

  private loadConfig(gltf: GLTF, config: ThreeSceneStudioManagerConfig) {
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

  exportGLTF(): Promise<ArrayBuffer> {
    const input = this.objectInfoManager.objectInfoStorage
      .getSceneObjectInfos()
      .map(info => info.data)
    const config = this.serialize()
    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter()
      exporter.register(writer => {
        return {
          beforeParse: objects => {
            if ((objects as any) === input) {
              const dummy: any = writer
              if (dummy.json === undefined) {
                reject('Invalid writer: json is undefined')
                return {}
              }
              if (dummy.json.extras === undefined) {
                dummy.json.extras = {}
              }
              dummy.json.extras['THREE_SCENE_STUDIO.CONFIG'] = config
            }
          },
        }
      })
      exporter.parse(
        input,
        result => {
          if (result instanceof ArrayBuffer) {
            resolve(result)
          } else {
            reject('Invalid result format')
          }
        },
        error => reject(error),
        {
          binary: true,
          includeCustomExtensions: true,
          onlyVisible: false,
          animations: this.objectInfoManager.objectInfoStorage
            .getAnimationObjectInfos()
            .map(info => info.data.data),
        } // Set to true for GLB export
      )
    })
  }

  serialize(): ThreeSceneStudioManagerConfig {
    return {
      variableManager: this.variableManager.serialize(),
      objectInfoManager: this.objectInfoManager.serialize(),
    }
  }
}
