import { z } from 'zod'
import {
  ObjectInfoStorage,
  objectInfoStorageConfigSchema,
} from './ObjectInfoStorage'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export const objectInfoManagerConfigSchema = z.object({
  objectInfoStorage: objectInfoStorageConfigSchema,
})

export type ObjectInfoManagerConfig = z.infer<
  typeof objectInfoManagerConfigSchema
>
export class ObjectInfoManager {
  readonly objectInfoStorage: ObjectInfoStorage
  constructor() {
    this.objectInfoStorage = new ObjectInfoStorage()
  }

  loadConfig(gltf: GLTF, config: ObjectInfoManagerConfig) {
    this.objectInfoStorage.loadConfig(gltf, config.objectInfoStorage)
  }

  serialize(): ObjectInfoManagerConfig {
    return {
      objectInfoStorage: this.objectInfoStorage.serialize(),
    }
  }
}
