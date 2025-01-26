import * as THREE from 'three'
import DataStorage from '../utils/DataStorage'
import { AnimationObjectInfo } from './AnimationObjectInfo'
import {
  CameraInfo,
  CameraObjectInfo,
  createCameraObjectFromInfo,
  createCameraObjectFromNative,
} from './camera'
import { ObjectInfo } from './ObjectInfo'
import { SceneObjectInfo } from './SceneObjectInfo'
import { BoneObjectInfo } from './BoneObjectInfo'
import { createLightObjectFromNative } from './light'
import { MeshObjectInfo } from './MeshObjectInfo'
import { GroupObjectInfo } from './GroupObjectInfo'
import { SkinMeshObjectInfo } from './SkinMeshObjectInfo'

export class ObjectInfoStorage extends DataStorage<string, ObjectInfo> {
  constructor() {
    super(value => value)
  }

  createSceneObjectInfo(group: THREE.Group) {
    const scene = new THREE.Scene()
    scene.add(...group.children)
    scene.name = group.name
    const result = new SceneObjectInfo(scene, this)
    this.set(result.config.id, result)
    return result
  }

  createEmptySceneObjectInfo(name: string) {
    const scene = new THREE.Scene()
    scene.name = name
    const result = new SceneObjectInfo(scene, this)
    this.set(result.config.id, result)
    return result
  }

  createCameraObjectInfo(camera: THREE.Camera) {
    const result = createCameraObjectFromNative(camera)
    this.set(result.config.id, result)
    return result
  }

  createCameraObjectInfoFromInfo(info: CameraInfo) {
    const camera = createCameraObjectFromInfo(info)
    this.set(camera.config.id, camera)
    return camera
  }

  createAnimationObjectInfo(animation: THREE.AnimationClip) {
    const result = new AnimationObjectInfo(animation, this)
    this.set(result.config.id, result)
    return result
  }

  createBoneObjectInfo(bone: THREE.Bone, sceneId: number) {
    const result = new BoneObjectInfo(bone, sceneId, this)
    this.set(result.config.id, result)
    return result
  }

  createLightObjectInfo(light: THREE.Light, sceneId: number) {
    const result = createLightObjectFromNative(light, this, sceneId)
    this.set(result.config.id, result)
    return result
  }

  createMeshObjectInfo(mesh: THREE.Mesh, sceneId: number) {
    const result = new MeshObjectInfo(mesh, sceneId, this)
    this.set(result.config.id, result)
    return result
  }

  createGroupObjectInfo(group: THREE.Object3D, sceneId: number) {
    const result = new GroupObjectInfo(group, sceneId, this)
    this.set(result.config.id, result)
    return result
  }

  createSkinMeshObjectInfo(mesh: THREE.SkinnedMesh, sceneId: number) {
    const result = new SkinMeshObjectInfo(mesh, sceneId, this)
    this.set(result.config.id, result)
    return result
  }

  setObjectInfo(objectInfo: ObjectInfo) {
    this.set(objectInfo.config.id, objectInfo)
  }

  getCameraObjectInfos() {
    return this.getAll().filter(value => value instanceof CameraObjectInfo)
  }

  getSceneObjectInfos() {
    return this.getAll().filter(value => value instanceof SceneObjectInfo)
  }

  getAnimationObjectInfos() {
    return this.getAll().filter(value => value instanceof AnimationObjectInfo)
  }

  getSceneBySceneId(sceneId: number) {
    return this.getAll().find(
      value =>
        value instanceof SceneObjectInfo && value.config.sceneId === sceneId
    )
  }
}
