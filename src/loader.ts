import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from './utils/response'
import { GLTF } from 'three/examples/jsm/Addons'

export interface GLTFLoaderOptions {
  dracoFilePath?: string
  onProgress?: (progress: number) => void
}

export { GLTF }

export const loadGltfFile = (
  url: string,
  options: GLTFLoaderOptions
): Promise<SuccessResponse<GLTF> | ErrorResponse<'LOAD_GLTF_FILE_ERROR'>> => {
  return new Promise<
    SuccessResponse<GLTF> | ErrorResponse<'LOAD_GLTF_FILE_ERROR'>
  >((resolve, reject) => {
    const loader = new GLTFLoader()
    if (options.dracoFilePath) {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(options.dracoFilePath)
      loader.setDRACOLoader(dracoLoader)
    }

    loader.load(
      url,
      gltf => resolve(successResponse(gltf)),
      // called as loading progresses
      xhr => {
        if (options.onProgress) options.onProgress(xhr.loaded / xhr.total)
      },
      error => resolve(errorResponse('LOAD_GLTF_FILE_ERROR', `${error}`))
    )
  })
}
