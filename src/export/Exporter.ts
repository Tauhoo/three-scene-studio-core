import * as THREE from 'three'
import { ThreeSceneStudioManager } from '../ThreeSceneStudioManager'
import { v4 as uuidv4 } from 'uuid'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import * as z from 'zod'
import { InSceneObjectInfo, SceneObjectInfo } from '../object'

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
  private objectHideHelperMap: Map<string, boolean> = new Map()
  private sceneHideHelperMap: Map<string, [boolean, boolean]> = new Map()

  constructor(manager: ThreeSceneStudioManager) {
    this.manager = manager
  }

  private hideHelper() {
    const objectInfos =
      this.manager.objectInfoManager.objectInfoStorage.getAll()
    for (const objectInfo of objectInfos) {
      if (!(objectInfo instanceof InSceneObjectInfo)) continue
      if (objectInfo.isHelperEnabled()) {
        this.objectHideHelperMap.set(objectInfo.config.id, true)
        objectInfo.helper(false)
      }

      if (objectInfo instanceof SceneObjectInfo) {
        const isHelperAxisActive = objectInfo.getIsHelperAxisActive()
        const isHelperGridActive = objectInfo.getIsHelperGridActive()
        this.sceneHideHelperMap.set(objectInfo.config.id, [
          isHelperAxisActive,
          isHelperGridActive,
        ])
        objectInfo.helperAxis(false)
        objectInfo.helperGrid(false)
      }
    }
  }

  private unhideHelper() {
    const objectInfos =
      this.manager.objectInfoManager.objectInfoStorage.getAll()
    for (const objectInfo of objectInfos) {
      if (!(objectInfo instanceof InSceneObjectInfo)) continue
      if (this.objectHideHelperMap.has(objectInfo.config.id)) {
        objectInfo.helper(true)
      }

      if (objectInfo instanceof SceneObjectInfo) {
        const [isHelperAxisActive, isHelperGridActive] =
          this.sceneHideHelperMap.get(objectInfo.config.id) ?? [false, false]
        objectInfo.helperAxis(isHelperAxisActive)
        objectInfo.helperGrid(isHelperGridActive)
      }
    }
    this.objectHideHelperMap.clear()
    this.sceneHideHelperMap.clear()
  }

  exportGLTF(): Promise<ArrayBuffer> {
    this.hideHelper()
    const input = this.manager.objectInfoManager.objectInfoStorage
      .getSceneObjectInfos()
      .map(info => info.data)
    const config = this.manager.serialize()

    const id = uuidv4()

    // create dummy scene
    const dummyScene = new THREE.Scene()
    dummyScene.name = id
    dummyScene.add(
      ...this.manager.objectInfoManager.objectInfoStorage
        .getCameraObjectInfos()
        .map(info => info.data)
    )

    const animations = this.manager.objectInfoManager.objectInfoStorage
      .getAnimationObjectInfos()
      .map(info => info.data.data)

    // create animation dummy target
    const nodeNameSet = new Set<string>()
    for (const animation of animations) {
      for (const track of animation.tracks) {
        const parsed = THREE.PropertyBinding.parseTrackName(track.name)
        nodeNameSet.add(parsed.nodeName)
      }
    }

    for (const nodeName of nodeNameSet) {
      const dummy = new THREE.Object3D()
      dummy.name = nodeName
      dummyScene.add(dummy)
    }

    return new Promise((resolve, reject) => {
      const exporter = new GLTFExporter()
      const cameraExtrasMap = new Map<
        number,
        { name: string; extras: Extras }
      >()

      exporter.register(writer => {
        const dummy: any = writer
        const jsonParsed = jsonSchema.safeParse(dummy.json)
        if (!jsonParsed.success) {
          this.unhideHelper()
          reject('Invalid writer: json is not valid')
          return {}
        }

        const json = dummy.json as Json

        return {
          writeNode: (object, nodeDef) => {
            if (object instanceof THREE.Camera) {
              const cameraNodeDefParsed =
                cameraNodeDefinitionSchema.safeParse(nodeDef)
              if (!cameraNodeDefParsed.success) {
                this.unhideHelper()
                reject('Invalid camera node definition: camera is undefined')
                return {}
              }
              cameraExtrasMap.set(cameraNodeDefParsed.data.camera, {
                name: object.name,
                extras: object.userData,
              })
              nodeDef.extras = object.userData
            }
          },
          afterParse: objects => {
            // inject main config
            if (json.extras === undefined) {
              json.extras = {}
            }
            json.extras['THREE_SCENE_STUDIO.CONFIG'] = config
            json.extras['THREE_SCENE_STUDIO.DUMMY_SCENE_NAME'] = dummyScene.name

            // inject camera extras
            if (Array.isArray(json.cameras)) {
              json.cameras = json.cameras.map((camera, index) => {
                const data = cameraExtrasMap.get(index)
                if (data === undefined) return camera
                camera.extras = data.extras
                camera.name = data.name

                return camera
              })
            }
          },
        }
      })

      exporter.parse(
        [dummyScene, ...input],
        result => {
          if (result instanceof ArrayBuffer) {
            this.unhideHelper()
            resolve(result)
          } else {
            this.unhideHelper()
            reject('Invalid result format')
          }
        },
        error => {
          this.unhideHelper()
          reject(error)
        },
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
