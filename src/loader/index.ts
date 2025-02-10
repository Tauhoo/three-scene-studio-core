import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from '../utils/response'
import {
  AnimationLoadedInfo,
  CameraLoadedInfo,
  InSceneLoadedInfo,
  SceneLoadedInfo,
} from './types'
export * from './types'
import { v4 as uuidv4 } from 'uuid'

export interface GLTFLoaderOptions {
  dracoFilePath?: string
  onProgress?: (progress: number) => void
}

export type GLTFLoadResult = {
  animations: AnimationLoadedInfo[]
  scenes: SceneLoadedInfo[]
  cameras: CameraLoadedInfo[]
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
          animations: gltf.animations.map(animation => ({
            id: uuidv4(),
            type: 'ANIMATION',
            name: animation.name,
            data: animation,
          })),
          scenes: gltf.scenes.map(createSceneLoadedInfo),
          cameras: gltf.cameras.map(camera => ({
            id: uuidv4(),
            type: 'CAMERA',
            name: camera.name,
            data: camera,
          })),
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

export function createSceneLoadedInfo(group: THREE.Group): SceneLoadedInfo {
  return {
    id: uuidv4(),
    type: 'SCENE',
    name: group.name,
    data: group,
    children: group.children
      .map(child => createLoadedInfo(child))
      .filter(value => value !== null),
  }
}

export function createLoadedInfo(
  object: THREE.Object3D
): InSceneLoadedInfo | null {
  if (object instanceof THREE.Group) {
    return {
      id: uuidv4(),
      type: 'GROUP',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  if (object instanceof THREE.SkinnedMesh) {
    return {
      id: uuidv4(),
      type: 'SKIN_MESH',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  if (object instanceof THREE.Mesh) {
    return {
      id: uuidv4(),
      type: 'MESH',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  if (object instanceof THREE.Light) {
    return {
      id: uuidv4(),
      type: 'LIGHT',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  if (object instanceof THREE.Bone) {
    return {
      id: uuidv4(),
      type: 'BONE',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  if (object.type === 'Object3D') {
    return {
      id: uuidv4(),
      type: 'GROUP',
      name: object.name,
      data: object,
      children: object.children
        .map(child => createLoadedInfo(child))
        .filter(value => value !== null),
    }
  }

  return null
}

export function transverseLoadedInfo(
  loadedInfo: InSceneLoadedInfo | SceneLoadedInfo,
  callback: (loadedInfo: InSceneLoadedInfo | SceneLoadedInfo) => void
) {
  callback(loadedInfo)
  for (const child of loadedInfo.children) {
    transverseLoadedInfo(child, callback)
  }
}
