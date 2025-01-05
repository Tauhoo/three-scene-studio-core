import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from './utils/response'
import {
  AnimationObjectInfo,
  CameraObjectInfo,
  createCameraObjectFromNative,
  SceneObjectInfo,
} from './object'

export interface GLTFLoaderOptions {
  dracoFilePath?: string
  onProgress?: (progress: number) => void
}

export type GLTFLoadResult = {
  animations: AnimationObjectInfo[]
  scenes: SceneObjectInfo[]
  cameras: CameraObjectInfo[]
}

export const loadGltfFile = (url: string, options: GLTFLoaderOptions) => {
  return new Promise<
    SuccessResponse<GLTFLoadResult> | ErrorResponse<'LOAD_GLTF_FILE_ERROR'>
  >((resolve, reject) => {
    const loader = new GLTFLoader()
    if (options.dracoFilePath) {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(options.dracoFilePath)
      loader.setDRACOLoader(dracoLoader)
    }

    loader.load(
      url,
      gltf => {
        const result: GLTFLoadResult = {
          animations: gltf.animations.map(
            animation => new AnimationObjectInfo(animation)
          ),
          scenes: gltf.scenes.map(scene => SceneObjectInfo.fromGroup(scene)),
          cameras: gltf.cameras.map(camera =>
            createCameraObjectFromNative(camera)
          ),
        }
        resolve(successResponse(result))
      },
      // called as loading progresses
      xhr => {
        if (options.onProgress) options.onProgress(xhr.loaded / xhr.total)
      },
      error => resolve(errorResponse('LOAD_GLTF_FILE_ERROR', `${error}`))
    )
  })
}
