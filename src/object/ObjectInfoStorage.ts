import * as THREE from 'three'
import DataStorage from '../utils/DataStorage'
import { AnimationObjectInfo } from './AnimationObjectInfo'
import {
  CameraInfo,
  CameraObjectInfo,
  createCameraObjectFromInfo,
  createCameraObjectFromNative,
} from './camera'
import { objectConfigSchema, ObjectInfo } from './ObjectInfo'
import { SceneObjectInfo } from './SceneObjectInfo'
import { BoneObjectInfo } from './BoneObjectInfo'
import { createLightObjectFromNative } from './light'
import { MeshObjectInfo } from './MeshObjectInfo'
import { GroupObjectInfo } from './GroupObjectInfo'
import { SkinMeshObjectInfo } from './SkinMeshObjectInfo'
import { SceneSwitcherInfo } from './SceneSwitcherObjectInfo'
import { CameraSwitcherInfo } from './CameraSwitcherObjectInfo'
import Switcher from '../utils/Switcher'
import { FormulaObjectInfo } from './FormulaObjectInfo'
import {
  InSceneObjectInfo,
  inSceneObjectInfoConfigSchema,
} from './InSceneObjectInfo'
import { z } from 'zod'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { FormulaInfo, FormulaNode } from '../utils'
import ObjectInfoStorageConfigLoader from './ObjectInfoStorageConfigLoader'

export const objectInfoStorageConfigSchema = z.object({
  inSceneObjectInfos: z.array(inSceneObjectInfoConfigSchema),
  uniqueObjectInfos: z.object({
    cameraSwitcher: objectConfigSchema.nullable(),
    sceneSwitcher: objectConfigSchema.nullable(),
  }),
  animationObjectInfos: z.array(objectConfigSchema),
  cameraObjectInfos: z.array(objectConfigSchema),
})

export type ObjectInfoStorageConfig = z.infer<
  typeof objectInfoStorageConfigSchema
>

export class ObjectInfoStorage extends DataStorage<string, ObjectInfo> {
  constructor() {
    super(value => value)
  }

  createSceneObjectInfo(
    group: THREE.Group,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const scene = new THREE.Scene()
    scene.add(...group.children)
    scene.name = group.name
    const result = new SceneObjectInfo(scene, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createEmptySceneObjectInfo(
    name: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const scene = new THREE.Scene()
    scene.name = name
    const result = new SceneObjectInfo(scene, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createCameraObjectInfo(camera: THREE.Camera, id?: string) {
    const result = createCameraObjectFromNative(camera, id)
    this.set(result.config.id, result)
    return result
  }

  createCameraObjectInfoFromInfo(info: CameraInfo) {
    const camera = createCameraObjectFromInfo(info)
    this.set(camera.config.id, camera)
    return camera
  }

  createAnimationObjectInfo(animation: THREE.AnimationClip, id?: string) {
    const result = new AnimationObjectInfo(animation, this, id)
    this.set(result.config.id, result)
    return result
  }

  createBoneObjectInfo(
    bone: THREE.Bone,
    sceneId: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const result = new BoneObjectInfo(bone, sceneId, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createLightObjectInfo(
    light: THREE.Light,
    sceneId: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const result = createLightObjectFromNative(
      light,
      this,
      sceneId,
      id,
      children
    )
    this.set(result.config.id, result)
    return result
  }

  createMeshObjectInfo(
    mesh: THREE.Mesh,
    sceneId: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const result = new MeshObjectInfo(mesh, sceneId, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createGroupObjectInfo(
    group: THREE.Object3D,
    sceneId: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const result = new GroupObjectInfo(group, sceneId, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createSkinMeshObjectInfo(
    mesh: THREE.SkinnedMesh,
    sceneId: string,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const result = new SkinMeshObjectInfo(mesh, sceneId, this, id, children)
    this.set(result.config.id, result)
    return result
  }

  createSceneSwitcherObjectInfo(
    sceneSwitcher: Switcher<SceneObjectInfo>,
    id?: string
  ) {
    const result = new SceneSwitcherInfo(sceneSwitcher, id)
    const sceneSwitcherInfo = this.getSceneSwitcherObjectInfo()
    if (sceneSwitcherInfo !== null) {
      this.delete(sceneSwitcherInfo.config.id)
    }
    this.set(result.config.id, result)
    return result
  }

  createCameraSwitcherObjectInfo(
    cameraSwitcher: Switcher<CameraObjectInfo>,
    id?: string
  ) {
    const result = new CameraSwitcherInfo(cameraSwitcher, id)
    const cameraSwitcherInfo = this.getCameraSwitcherObjectInfo()
    if (cameraSwitcherInfo !== null) {
      this.delete(cameraSwitcherInfo.config.id)
    }
    this.set(result.config.id, result)
    return result
  }

  createFormulaObjectInfo(
    formulaNode: FormulaNode,
    initValue: number | number[],
    id?: string
  ) {
    const result = new FormulaObjectInfo(formulaNode, initValue, id)
    this.set(result.config.id, result)
    return result
  }

  setObjectInfo(objectInfo: ObjectInfo) {
    this.set(objectInfo.config.id, objectInfo)
  }

  getSceneSwitcherObjectInfo(): SceneSwitcherInfo | null {
    const sceneSwitcherInfos = this.getAll().filter(
      value => value instanceof SceneSwitcherInfo
    )
    return sceneSwitcherInfos[0] ?? null
  }

  getCameraSwitcherObjectInfo(): CameraSwitcherInfo | null {
    const cameraSwitcherInfos = this.getAll().filter(
      value => value instanceof CameraSwitcherInfo
    )
    return cameraSwitcherInfos[0] ?? null
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

  getFormulaObjectInfos() {
    return this.getAll().filter(value => value instanceof FormulaObjectInfo)
  }

  getInSceneObjectInfos() {
    return this.getAll().filter(value => value instanceof InSceneObjectInfo)
  }

  getSceneById(id: string) {
    const result = this.get(id)
    if (result instanceof SceneObjectInfo) {
      return result
    }
    return null
  }

  delete(reference: string) {
    const objectInfo = this.get(reference)
    if (objectInfo === null) {
      return null
    }
    objectInfo.destroy()
    return super.delete(reference)
  }

  loadConfig(
    gltf: GLTF,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    config: ObjectInfoStorageConfig
  ) {
    const objectInfoStorageConfigLoader = new ObjectInfoStorageConfigLoader(
      this
    )
    objectInfoStorageConfigLoader.loadConfig(
      gltf,
      cameraSwitcher,
      sceneSwitcher,
      config
    )
  }

  serialize(): ObjectInfoStorageConfig {
    const cameraSwitcherObjectInfo = this.getCameraSwitcherObjectInfo()
    const sceneSwitcherObjectInfo = this.getSceneSwitcherObjectInfo()
    const result = {
      inSceneObjectInfos: this.getInSceneObjectInfos().map(objectInfo =>
        objectInfo.serialize()
      ),
      uniqueObjectInfos: {
        cameraSwitcher:
          cameraSwitcherObjectInfo === null
            ? null
            : cameraSwitcherObjectInfo.serialize(),
        sceneSwitcher:
          sceneSwitcherObjectInfo === null
            ? null
            : sceneSwitcherObjectInfo.serialize(),
      },
      animationObjectInfos: this.getAnimationObjectInfos().map(objectInfo =>
        objectInfo.serialize()
      ),
      cameraObjectInfos: this.getCameraObjectInfos().map(objectInfo =>
        objectInfo.serialize()
      ),
    }
    return result
  }

  destroy() {
    for (const objectInfo of this.getSceneObjectInfos()) {
      this.delete(objectInfo.config.id)
    }
    for (const objectInfo of this.getAll()) {
      this.delete(objectInfo.config.id)
    }
  }
}
