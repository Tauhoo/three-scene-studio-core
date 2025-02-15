import * as THREE from 'three'
import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'
import { v4 as uuidv4 } from 'uuid'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import * as z from 'zod'

const extrasSchema = z.record(z.any())

type Extras = z.infer<typeof extrasSchema>
const objectDefinitionSchema = z.object({
  name: z.string().optional(),
  extras: extrasSchema.optional(),
})

const cameraNodeDefinitionSchema = z.object({
  name: z.string().optional(),
  camera: z.number(),
  extras: extrasSchema.optional(),
})

const jsonSchema = z.object({
  animations: z.array(objectDefinitionSchema).optional(),
  scenes: z.array(objectDefinitionSchema).optional(),
  cameras: z.array(objectDefinitionSchema).optional(),
  extras: extrasSchema.optional(),
})

type Json = z.infer<typeof jsonSchema>

export class Exporter {
  readonly manager: ThreeSceneStudioManager

  constructor(manager: ThreeSceneStudioManager) {
    this.manager = manager
  }

  exportGLTF(): Promise<ArrayBuffer> {
    const input = this.manager.objectInfoManager.objectInfoStorage
      .getSceneObjectInfos()
      .map(info => info.data)
    const config = this.manager.serialize()
    const dummyScene = new THREE.Scene()
    dummyScene.name = uuidv4()
    dummyScene.add(
      ...this.manager.objectInfoManager.objectInfoStorage
        .getCameraObjectInfos()
        .map(info => info.data)
    )

    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter()
      const cameraExtrasMap = new Map<number, Extras>()
      const animations = this.manager.objectInfoManager.objectInfoStorage
        .getAnimationObjectInfos()
        .map(info => info.data.data)

      exporter.register(writer => {
        const dummy: any = writer
        const jsonParsed = jsonSchema.safeParse(dummy.json)
        if (!jsonParsed.success) {
          reject('Invalid writer: json is not valid')
          return {}
        }

        const json = dummy.json as Json

        return {
          writeNode(object, nodeDef) {
            if (object instanceof THREE.Camera) {
              const cameraNodeDefParsed =
                cameraNodeDefinitionSchema.safeParse(nodeDef)
              if (!cameraNodeDefParsed.success) {
                reject('Invalid camera node definition: camera is undefined')
                return {}
              }
              cameraExtrasMap.set(
                cameraNodeDefParsed.data.camera,
                object.userData
              )
              nodeDef.extras = object.userData
            }
          },
          afterParse: objects => {
            // inject main config
            if (json.extras === undefined) {
              json.extras = {}
            }
            json.extras['THREE_SCENE_STUDIO.CONFIG'] = config

            // remove dummy scene
            if (Array.isArray(json.scenes)) {
              json.scenes = json.scenes.filter(
                (scene: { name?: string }) => scene.name !== dummyScene.name
              )
            }

            // inject camera extras
            if (Array.isArray(json.cameras)) {
              json.cameras = json.cameras.map((camera, index) => {
                camera.extras = cameraExtrasMap.get(index) ?? {}
                return camera
              })
            }
          },
        }
      })
      exporter.parse(
        [...input, dummyScene],
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
          animations,
        } // Set to true for GLB export
      )
    })
  }
}

export default Exporter
