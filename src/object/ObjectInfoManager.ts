import * as THREE from 'three'
import { ObjectInfo, ObjectInSceneInfo, ObjectReference, ObjectType } from '.'
import {
  AnimationObjectInfo,
  AnimationObjectInfoStorage,
} from './AnimationObjectInfo'
import { CameraObjectInfo, CameraObjectInfoStorage } from './CameraObjectInfo'
import { LightObjectInfo, LightObjectInfoStorage } from './LightObjectInfo'
import { MeshObjectInfo, MeshObjectInfoStorage } from './MeshObjectInfo'
import { SceneObjectInfo, SceneObjectInfoStorage } from './SceneObjectInfo'
import EventDispatcher from '../utils/EventDispatcher'

type ObjectInfoManagerEvent = {
  type: 'OBJECT_INFO_ADDED'
  data: ObjectInfo
}

export class ObjectInfoManager extends EventDispatcher<ObjectInfoManagerEvent> {
  private animationObjectInfoStorage: AnimationObjectInfoStorage
  private cameraObjectInfoStorage: CameraObjectInfoStorage
  private lightObjectInfoStorage: LightObjectInfoStorage
  private meshObjectInfoStorage: MeshObjectInfoStorage
  private sceneObjectInfoStorage: SceneObjectInfoStorage

  constructor() {
    super()
    this.animationObjectInfoStorage = new AnimationObjectInfoStorage()
    this.cameraObjectInfoStorage = new CameraObjectInfoStorage()
    this.lightObjectInfoStorage = new LightObjectInfoStorage()
    this.meshObjectInfoStorage = new MeshObjectInfoStorage()
    this.sceneObjectInfoStorage = new SceneObjectInfoStorage()
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

  createSceneObjectInfo(name: string) {
    const newScene = new THREE.Scene()
    newScene.name = name
    const info = new SceneObjectInfo(newScene)
    this.sceneObjectInfoStorage.set(info.reference, info)
    this.dispatch('OBJECT_INFO_ADDED', info)
    return info
  }

  addObjectInSceneInfo(
    objectInfo: ObjectInSceneInfo,
    sceneInfo: SceneObjectInfo
  ) {
    if (objectInfo.reference.type === 'OBJECT_3D_MESH') {
      this.meshObjectInfoStorage.set(
        objectInfo.reference,
        objectInfo as MeshObjectInfo
      )
      sceneInfo.addObjectInSceneInfo(objectInfo)
    } else if (objectInfo.reference.type === 'OBJECT_3D_LIGHT') {
      this.lightObjectInfoStorage.set(
        objectInfo.reference,
        objectInfo as LightObjectInfo
      )
      sceneInfo.addObjectInSceneInfo(objectInfo)
    } else if (objectInfo.reference.type === 'OBJECT_3D_GROUP') {
      sceneInfo.addObjectInSceneInfo(objectInfo)
    }
  }
}
