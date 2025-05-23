import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { ObjectInfoStorage, ObjectInfoStorageConfig } from './ObjectInfoStorage'
import { InSceneObjectInfo, InSceneObjectInfoConfig } from './InSceneObjectInfo'
import { lightObjectConfigSchema } from './light'
import { ObjectConfig, ObjectInfo } from './ObjectInfo'
import { boneObjectConfigSchema } from './BoneObjectInfo'
import { groupObjectConfigSchema } from './GroupObjectInfo'
import { meshObjectConfigSchema } from './MeshObjectInfo'
import { skinMeshObjectConfigSchema } from './SkinMeshObjectInfo'
import { sceneObjectConfigSchema, SceneObjectInfo } from './SceneObjectInfo'
import {
  formulaObjectConfigSchema,
  FormulaObjectInfo,
} from './FormulaObjectInfo'
import {
  animationObjectConfigSchema,
  AnimationObjectInfo,
} from './AnimationObjectInfo'
import {
  CameraObjectConfig,
  cameraObjectConfigSchema,
  CameraObjectInfo,
} from './camera'
import { CameraSwitcherInfo } from './CameraSwitcherObjectInfo'
import { SceneSwitcherInfo } from './SceneSwitcherObjectInfo'
import Switcher from '../utils/Switcher'
import { parse, predictNodeValueType } from '../utils'
import { MaterialObjectInfo } from './material'

type SceneMap = Map<string, Map<string, THREE.Object3D>>
type InSceneObjectInfoConfigMap = Map<string, InSceneObjectInfoConfig>
type CameraObjectInfoConfigMap = Map<string, CameraObjectConfig>

class ObjectInfoStorageConfigLoader {
  constructor(private readonly objectInfoStorage: ObjectInfoStorage) {}

  createSceneMap(gltf: GLTF) {
    const sceneMap: SceneMap = new Map<string, Map<string, THREE.Object3D>>()
    for (const scene of gltf.scenes) {
      const sceneObjectId = scene.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID']
      if (typeof sceneObjectId !== 'string') {
        continue
      }
      const sceneObjectMap = new Map<string, THREE.Object3D>()
      scene.traverse(object => {
        const objectInfoId =
          object.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID']
        if (typeof objectInfoId !== 'string') {
          return
        }
        sceneObjectMap.set(objectInfoId, object)
      })
      sceneMap.set(sceneObjectId, sceneObjectMap)
    }
    return sceneMap
  }

  createInSceneObjectInfoConfigMap(
    config: InSceneObjectInfoConfig[]
  ): InSceneObjectInfoConfigMap {
    const inSceneObjectInfoConfigMap: InSceneObjectInfoConfigMap = new Map()
    for (const inSceneObjectInfo of config) {
      inSceneObjectInfoConfigMap.set(inSceneObjectInfo.id, inSceneObjectInfo)
    }
    return inSceneObjectInfoConfigMap
  }

  createCameraObjectInfoConfigMap(
    config: CameraObjectConfig[]
  ): CameraObjectInfoConfigMap {
    const cameraObjectInfoConfigMap: CameraObjectInfoConfigMap = new Map()
    for (const cameraObjectInfo of config) {
      cameraObjectInfoConfigMap.set(cameraObjectInfo.id, cameraObjectInfo)
    }
    return cameraObjectInfoConfigMap
  }

  loadConfig(
    gltf: GLTF,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    config: ObjectInfoStorageConfig
  ) {
    const sceneMap = this.createSceneMap(gltf)
    this.loadMaterialObjectInfoList(gltf, config.materialObjectInfos)
    this.loadInSceneObjectInfoList(config.inSceneObjectInfos, sceneMap)
    this.loadCameraObjectInfoList(gltf, config.cameraObjectInfos)
    this.loadAnimationObjectInfoList(gltf, config.animationObjectInfos)
    this.loadUniqueObjectInfoList(
      cameraSwitcher,
      sceneSwitcher,
      config.uniqueObjectInfos
    )
  }

  // TODO: Implement this
  loadMaterialObjectInfoList(
    gltf: GLTF,
    materialObjectInfoConfigList: ObjectConfig[]
  ): MaterialObjectInfo[] {
    const materialObjectInfos: MaterialObjectInfo[] = []
    return materialObjectInfos
  }

  loadCameraObjectInfoList(
    gltf: GLTF,
    cameraObjectInfoConfigList: ObjectConfig[]
  ): CameraObjectInfo[] {
    const cameraObjectInfos: CameraObjectInfo[] = []
    const parsedResult = cameraObjectInfoConfigList
      .map(value => cameraObjectConfigSchema.safeParse(value))
      .filter(value => value.success)
    const cameraObjectInfoConfigMap = this.createCameraObjectInfoConfigMap(
      parsedResult.map(value => value.data)
    )
    for (const cameraData of gltf.cameras) {
      const value = cameraData.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID']
      if (typeof value !== 'string') continue
      const cameraObjectInfoConfig = cameraObjectInfoConfigMap.get(value)
      if (cameraObjectInfoConfig === undefined) continue
      const cameraObjectInfo = this.objectInfoStorage.createCameraObjectInfo(
        cameraData,
        cameraObjectInfoConfig.id
      )
      if (cameraObjectInfo === null) continue
      cameraObjectInfos.push(cameraObjectInfo)
    }
    return cameraObjectInfos
  }

  loadUniqueObjectInfoList(
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    uniqueObjectInfoConfigList: {
      cameraSwitcher: ObjectConfig | null
      sceneSwitcher: ObjectConfig | null
    }
  ) {
    const cameraSwitcherInfo =
      this.objectInfoStorage.createCameraSwitcherObjectInfo(
        cameraSwitcher,
        uniqueObjectInfoConfigList.cameraSwitcher?.id
      )
    const sceneSwitcherInfo =
      this.objectInfoStorage.createSceneSwitcherObjectInfo(
        sceneSwitcher,
        uniqueObjectInfoConfigList.sceneSwitcher?.id
      )

    return {
      cameraSwitcher: cameraSwitcherInfo,
      sceneSwitcher: sceneSwitcherInfo,
    }
  }

  loadAnimationObjectInfoList(
    gltf: GLTF,
    animationObjectInfoConfigList: ObjectConfig[]
  ): AnimationObjectInfo[] {
    const animationObjectInfos: AnimationObjectInfo[] = []
    const lenght = Math.min(
      animationObjectInfoConfigList.length,
      gltf.animations.length
    )
    for (let i = 0; i < lenght; i++) {
      const animationObjectInfoConfig = animationObjectInfoConfigList[i]
      if (animationObjectInfoConfig === undefined) continue
      const configParseResult = animationObjectConfigSchema.safeParse(
        animationObjectInfoConfig
      )
      if (!configParseResult.success) continue
      const animation = gltf.animations[i]
      if (animation === undefined) continue

      const result = this.objectInfoStorage.createAnimationObjectInfo(
        animation,
        animationObjectInfoConfig.id
      )
      if (result === null) continue
      animationObjectInfos.push(result)
    }
    return animationObjectInfos
  }

  loadInSceneObjectInfoList(
    configList: InSceneObjectInfoConfig[],
    sceneMap: SceneMap
  ): InSceneObjectInfo[] {
    const inSceneObjectInfos: InSceneObjectInfo[] = []
    for (const inSceneObjectInfo of configList) {
      const sceneObjectMap = sceneMap.get(inSceneObjectInfo.sceneId)
      if (sceneObjectMap === undefined) {
        continue
      }
      const objectData = sceneObjectMap.get(inSceneObjectInfo.id)
      if (objectData === undefined) {
        continue
      }

      const result = this.loadObjectInfoConfig(objectData, inSceneObjectInfo)
      if (result === null) continue
      inSceneObjectInfos.push(result)
    }
    return inSceneObjectInfos
  }

  loadObjectInfoConfig(
    objectData: THREE.Object3D,
    inSceneObjectInfo: InSceneObjectInfoConfig
  ): InSceneObjectInfo | null {
    // check if object info already exists
    const objectInfo = this.objectInfoStorage.get(inSceneObjectInfo.id)
    if (objectInfo instanceof InSceneObjectInfo) return objectInfo
    if (
      inSceneObjectInfo.type === 'OBJECT_3D_LIGHT' &&
      objectData instanceof THREE.Light
    ) {
      const parseResult = lightObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createLightObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        inSceneObjectInfo.id
      )
    }

    if (
      inSceneObjectInfo.type === 'OBJECT_3D_BONE' &&
      objectData instanceof THREE.Bone
    ) {
      const parseResult = boneObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createBoneObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        inSceneObjectInfo.id
      )
    }

    if (inSceneObjectInfo.type === 'OBJECT_3D_GROUP') {
      const parseResult = groupObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createGroupObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        inSceneObjectInfo.id
      )
    }

    if (
      inSceneObjectInfo.type === 'OBJECT_3D_MESH' &&
      objectData instanceof THREE.Mesh
    ) {
      const parseResult = meshObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createMeshObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        parseResult.data.materialRouterObjectInfoIds,
        inSceneObjectInfo.id
      )
    }

    if (
      inSceneObjectInfo.type === 'OBJECT_3D_SKIN_MESH' &&
      objectData instanceof THREE.SkinnedMesh
    ) {
      const parseResult =
        skinMeshObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createSkinMeshObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        parseResult.data.materialRouterObjectInfoIds,
        inSceneObjectInfo.id
      )
    }

    if (
      inSceneObjectInfo.type === 'OBJECT_3D_SCENE' &&
      objectData instanceof THREE.Group
    ) {
      const parseResult = sceneObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createSceneObjectInfo(
        objectData,
        inSceneObjectInfo.id
      )
    }
    return null
  }
}

export default ObjectInfoStorageConfigLoader
