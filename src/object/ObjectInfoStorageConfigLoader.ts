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
import { sceneObjectConfigSchema } from './SceneObjectInfo'
import {
  formulaObjectConfigSchema,
  FormulaObjectInfo,
} from './FormulaObjectInfo'
import { parseExpression } from '../utils'
import {
  animationObjectConfigSchema,
  AnimationObjectInfo,
} from './AnimationObjectInfo'
import { CameraObjectInfo } from './camera'
import { CameraSwitcherInfo } from './CameraSwitcherObjectInfo'
import { SceneSwitcherInfo } from './SceneSwitcherObjectInfo'

type SceneMap = Map<string, Map<string, THREE.Object3D>>
type InSceneObjectInfoConfigMap = Map<string, InSceneObjectInfoConfig>

class ObjectInfoStorageConfigLoader {
  constructor(private readonly objectInfoStorage: ObjectInfoStorage) {}

  createSceneMap(gltf: GLTF) {
    const sceneMap: SceneMap = new Map<string, Map<string, THREE.Object3D>>()
    for (const scene of gltf.scenes) {
      const sceneObjectId = scene.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID']
      if (sceneObjectId === undefined) {
        continue
      }
      const sceneObjectMap = new Map<string, THREE.Object3D>()
      scene.traverse(object => {
        const objectInfoId =
          object.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID']
        if (objectInfoId === undefined) {
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
    const inSceneObjectInfoConfigMap = new Map<
      string,
      InSceneObjectInfoConfig
    >()
    for (const inSceneObjectInfo of config) {
      inSceneObjectInfoConfigMap.set(inSceneObjectInfo.id, inSceneObjectInfo)
    }
    return inSceneObjectInfoConfigMap
  }

  loadConfig(gltf: GLTF, config: ObjectInfoStorageConfig) {
    const sceneMap = this.createSceneMap(gltf)
    const inSceneObjectInfoConfigMap = this.createInSceneObjectInfoConfigMap(
      config.inSceneObjectInfos
    )
    this.loadInSceneObjectInfoList(
      config.inSceneObjectInfos,
      sceneMap,
      inSceneObjectInfoConfigMap
    )
    this.loadFormulaObjectInfoList(config.formulaObjectInfos)
    this.loadAnimationObjectInfoList(gltf, config.animationObjectInfos)
    this.loadCameraObjectInfoList(gltf, config.cameraObjectInfos)
    this.loadUniqueObjectInfoList(config.uniqueObjectInfos)
  }

  loadCameraObjectInfoList(
    gltf: GLTF,
    cameraObjectInfoConfigList: ObjectConfig[]
  ): CameraObjectInfo[] {
    // TODO: implement
    const cameraObjectInfos: CameraObjectInfo[] = []
    return cameraObjectInfos
  }

  loadUniqueObjectInfoList(uniqueObjectInfoConfigList: {
    cameraSwitcher: ObjectConfig | null
    sceneSwitcher: ObjectConfig | null
  }): {
    cameraSwitcher: CameraSwitcherInfo | null
    sceneSwitcher: SceneSwitcherInfo | null
  } {
    // TODO: implement
    return {
      cameraSwitcher: null,
      sceneSwitcher: null,
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

  loadFormulaObjectInfoList(
    formulaObjectInfoConfigList: ObjectConfig[]
  ): FormulaObjectInfo[] {
    const formulaObjectInfos: FormulaObjectInfo[] = []
    for (const formulaObjectInfoConfig of formulaObjectInfoConfigList) {
      const parseConfigResult = formulaObjectConfigSchema.safeParse(
        formulaObjectInfoConfig
      )
      if (!parseConfigResult.success) continue
      const configValue = parseConfigResult.data
      const parsedFormulaResult = parseExpression(configValue.formula)
      if (parsedFormulaResult.status === 'ERROR') continue
      const result = this.objectInfoStorage.createFormulaObjectInfo(
        parsedFormulaResult.data,
        formulaObjectInfoConfig.id
      )
      if (result === null) continue
      formulaObjectInfos.push(result)
    }
    return formulaObjectInfos
  }

  loadInSceneObjectInfoList(
    configList: InSceneObjectInfoConfig[],
    sceneMap: SceneMap,
    inSceneObjectInfoConfigMap: InSceneObjectInfoConfigMap
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

      const result = this.loadObjectInfoConfig(
        objectData,
        inSceneObjectInfo,
        sceneMap,
        inSceneObjectInfoConfigMap
      )
      if (result === null) continue
      inSceneObjectInfos.push(result)
    }
    return inSceneObjectInfos
  }

  loadObjectInfoConfig(
    objectData: THREE.Object3D,
    inSceneObjectInfo: InSceneObjectInfoConfig,
    sceneMap: SceneMap,
    inSceneObjectInfoConfigMap: InSceneObjectInfoConfigMap
  ): InSceneObjectInfo | null {
    // check if object info already exists
    const objectInfo = this.objectInfoStorage.get(inSceneObjectInfo.id)
    if (objectInfo instanceof InSceneObjectInfo) return objectInfo

    // load children
    let children: InSceneObjectInfo[] = []
    if (inSceneObjectInfo.childrenIds.length > 0) {
      const childrenConfigList: InSceneObjectInfoConfig[] =
        inSceneObjectInfo.childrenIds
          .map(id => inSceneObjectInfoConfigMap.get(id))
          .filter(config => config !== undefined)
      children = this.loadInSceneObjectInfoList(
        childrenConfigList,
        sceneMap,
        inSceneObjectInfoConfigMap
      )
    }

    if (
      inSceneObjectInfo.type === 'OBJECT_3D_LIGHT' &&
      objectData instanceof THREE.Light
    ) {
      const parseResult = lightObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createLightObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        inSceneObjectInfo.id,
        children
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
        inSceneObjectInfo.id,
        children
      )
    }

    if (inSceneObjectInfo.type === 'OBJECT_3D_GROUP') {
      const parseResult = groupObjectConfigSchema.safeParse(inSceneObjectInfo)
      if (!parseResult.success) return null
      return this.objectInfoStorage.createGroupObjectInfo(
        objectData,
        inSceneObjectInfo.sceneId,
        inSceneObjectInfo.id,
        children
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
        inSceneObjectInfo.id,
        children
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
        inSceneObjectInfo.id,
        children
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
        inSceneObjectInfo.id,
        children
      )
    }
    return null
  }
}

export default ObjectInfoStorageConfigLoader
