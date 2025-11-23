import { z } from 'zod'
import {
  ObjectInfoStorage,
  objectInfoStorageConfigSchema,
} from './ObjectInfoStorage'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import Switcher from '../utils/Switcher'
import { CameraObjectInfo } from './camera'
import { SceneObjectInfo } from './SceneObjectInfo'
import { Clock } from '../Clock'
import Context from '../utils/Context'

export const objectInfoManagerConfigSchema = z.object({
  objectInfoStorage: objectInfoStorageConfigSchema,
})

export type ObjectInfoManagerConfig = z.infer<
  typeof objectInfoManagerConfigSchema
>
export class ObjectInfoManager {
  readonly objectInfoStorage: ObjectInfoStorage

  constructor(clock: Clock, context: Context) {
    this.objectInfoStorage = new ObjectInfoStorage(clock, context)
  }

  loadConfig(
    gltf: GLTF,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    config: ObjectInfoManagerConfig
  ) {
    this.objectInfoStorage.loadConfig(
      gltf,
      cameraSwitcher,
      sceneSwitcher,
      config.objectInfoStorage
    )
  }

  serialize(): ObjectInfoManagerConfig {
    return {
      objectInfoStorage: this.objectInfoStorage.serialize(),
    }
  }

  destroy() {
    this.objectInfoStorage.destroy()
  }
}
