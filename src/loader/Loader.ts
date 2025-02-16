import {
  ThreeSceneStudioManager,
  ThreeSceneStudioManagerConfig,
} from '../ThreeSceneStudioManager'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { threeSceneStudioManagerConfigSchema } from '../ThreeSceneStudioManager'
import { z } from 'zod'
import * as THREE from 'three'

const nodeSchema = z.union([
  z.object({
    name: z.string().optional(),
    extras: z.any().optional(),
  }),
  z.object({
    name: z.string().optional(),
    extras: z.any().optional(),
    camera: z.number(),
    matrix: z.array(z.number()).optional(),
  }),
])

const jsonSchema = z.object({
  nodes: z.array(nodeSchema),
})

type Json = z.infer<typeof jsonSchema>

export class Loader {
  readonly manager: ThreeSceneStudioManager

  constructor(manager: ThreeSceneStudioManager) {
    this.manager = manager
  }

  async loadGLTFByURL(url: string) {
    const loader = new GLTFLoader()

    let json: Json | null = null as any
    loader.register(parser => {
      // prevent duplicate name
      parser.createUniqueName = (name: string) => name

      // set up json
      const jsonParsed = jsonSchema.safeParse(parser.json)
      if (!jsonParsed.success)
        return {
          name: 'THREE_SCENE_STUDIO.LOADER',
        }
      json = parser.json as Json

      return {
        name: 'THREE_SCENE_STUDIO.LOADER',
      }
    })

    const gltf = await loader.loadAsync(url)
    if (json === null) return this.loadGLTF(gltf)

    // update camera matrix
    const cameraMatrixMap = new Map<number, THREE.Matrix4>()
    for (const node of json.nodes) {
      if ('camera' in node && node.matrix !== undefined) {
        const matrix = new THREE.Matrix4()
        matrix.fromArray(node.matrix)
        cameraMatrixMap.set(node.camera, matrix)
      }
    }

    for (const [index, camera] of gltf.cameras.entries()) {
      const matrix = cameraMatrixMap.get(index)
      if (matrix) {
        camera.applyMatrix4(matrix)
      }
    }

    return this.loadGLTF(gltf)
  }

  loadGLTF(gltf: GLTF) {
    const dummySceneName = gltf.userData['THREE_SCENE_STUDIO.DUMMY_SCENE_NAME']
    const config = gltf.userData['THREE_SCENE_STUDIO.CONFIG']
    const extraData = gltf.userData['THREE_SCENE_STUDIO.EXTRA_DATA']
    const parsedConfig = threeSceneStudioManagerConfigSchema.safeParse(config)
    if (!parsedConfig.success) return null
    gltf.scenes = gltf.scenes.filter(scene => scene.name !== dummySceneName)
    this.manager.loadConfig(gltf, config as ThreeSceneStudioManagerConfig)
    return extraData as Record<string, any> | null
  }
}
