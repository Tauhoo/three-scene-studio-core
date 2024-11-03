import { GLTF } from '../loader'
import { ObjectInfo, ObjectReference, ObjectType } from '.'
import { AnimationObjectInfoStorage } from './AnimationObjectInfo'
import { CameraObjectInfoStorage } from './CameraObjectInfo'
import { LightObjectInfoStorage } from './LightObjectInfo'
import { MeshObjectInfoStorage } from './MeshObjectInfo'
import { SceneObjectInfoStorage } from './SceneObjectInfo'

export class ObjectInfoManager {
  private animationObjectInfoStorage: AnimationObjectInfoStorage
  private cameraObjectInfoStorage: CameraObjectInfoStorage
  private lightObjectInfoStorage: LightObjectInfoStorage
  private meshObjectInfoStorage: MeshObjectInfoStorage
  private sceneObjectInfoStorage: SceneObjectInfoStorage
  constructor() {
    this.animationObjectInfoStorage = new AnimationObjectInfoStorage()
    this.cameraObjectInfoStorage = new CameraObjectInfoStorage()
    this.lightObjectInfoStorage = new LightObjectInfoStorage()
    this.meshObjectInfoStorage = new MeshObjectInfoStorage()
    this.sceneObjectInfoStorage = new SceneObjectInfoStorage()
  }

  loadGLTF(gltf: GLTF) {
    this.animationObjectInfoStorage.setMultipleNative(gltf.animations)
    this.cameraObjectInfoStorage.setMultipleNative(gltf.cameras)
    this.lightObjectInfoStorage.setMultipleNative(gltf.scenes)
    this.meshObjectInfoStorage.setMultipleNative(gltf.scenes)
    this.sceneObjectInfoStorage.setMultipleNative(gltf.scenes)
  }

  getObjectInfoByReference<T extends ObjectReference>(
    reference: T
  ): Extract<ObjectInfo, { reference: T }> | null {
    if (reference.type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_MESH') {
      return this.meshObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    } else if (reference.type === 'OBJECT_3D_LIGHT') {
      return this.lightObjectInfoStorage.get(reference) as Extract<
        ObjectInfo,
        { reference: T }
      >
    }
    return null
  }

  getObjectInfos<T extends ObjectType>(
    type: T
  ): Extract<ObjectInfo, { reference: { type: T } }>[] {
    if (type === 'OBJECT_3D_CAMERA') {
      return this.cameraObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_SCENE') {
      return this.sceneObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_ANIMATION') {
      return this.animationObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_MESH') {
      return this.meshObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    } else if (type === 'OBJECT_3D_LIGHT') {
      return this.lightObjectInfoStorage.getAll() as Extract<
        ObjectInfo,
        { reference: { type: T } }
      >[]
    }
    return []
  }
}
