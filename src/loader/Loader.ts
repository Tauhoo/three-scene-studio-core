import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { threeSceneStudioManagerConfigSchema } from '../ThreeSceneStudioManager'

export class Loader {
  readonly manager: ThreeSceneStudioManager

  constructor(manager: ThreeSceneStudioManager) {
    this.manager = manager
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
    this.manager.loadConfig(gltf, parsedConfig.data)
  }
}
