import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { ObjectInfoStorage, ObjectInfoStorageConfig } from './ObjectInfoStorage'
import { ObjectConfig } from './ObjectInfo'
import { SceneObjectInfo } from './SceneObjectInfo'
import {
  animationObjectConfigSchema,
  AnimationObjectInfo,
} from './AnimationObjectInfo'
import { CameraObjectInfo } from './camera'
import Switcher from '../utils/Switcher'
import {
  MaterialObjectInfo,
  MaterialRouterObjectInfoConfigSchema,
} from './material'

class ObjectInfoStorageConfigLoader {
  constructor(private readonly objectInfoStorage: ObjectInfoStorage) {}

  loadConfig(
    gltf: GLTF,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    config: ObjectInfoStorageConfig
  ) {
    // ThreeJS GLTF loading
    this.loadMaterialObjectInfoList(gltf)
    this.loadMaterialRouterObjectInfoList(config)
    this.loadInSceneObjectInfoList(gltf)
    this.loadCameraObjectInfoList(gltf)

    // ThreeJS Custom loading
    this.loadAnimationObjectInfoList(gltf, config.animationObjectInfos)

    // ThreeSceneStudio Unique Object loading
    this.loadUniqueObjectInfoList(
      cameraSwitcher,
      sceneSwitcher,
      config.uniqueObjectInfos
    )
  }

  loadMaterialObjectInfoList(gltf: GLTF) {
    for (const scene of gltf.scenes) {
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          const result = this.objectInfoStorage.createMaterialObjectInfo(
            object.material
          )
        }
      })
    }
  }

  loadMaterialRouterObjectInfoList(config: ObjectInfoStorageConfig) {
    for (const materialRouterObjectInfoConfig of config.materialRouterObjectInfos) {
      const parseResult = MaterialRouterObjectInfoConfigSchema.safeParse(
        materialRouterObjectInfoConfig
      )
      if (!parseResult.success) continue
      const materialRouterObjectInfo = parseResult.data
      const materialObjectInfos: MaterialObjectInfo[] = []
      for (const materialId of materialRouterObjectInfo.materialIds) {
        if (materialId === null) {
          materialObjectInfos.push(
            this.objectInfoStorage.createDefaultStandardMaterialObjectInfo()
          )
          continue
        }
        const materialObjectInfo = this.objectInfoStorage.get(materialId)
        if (materialObjectInfo instanceof MaterialObjectInfo) {
          materialObjectInfos.push(materialObjectInfo)
        } else {
          materialObjectInfos.push(
            this.objectInfoStorage.createDefaultStandardMaterialObjectInfo()
          )
        }
      }
      this.objectInfoStorage.createMaterialRouterObjectInfo(
        materialRouterObjectInfo.name,
        materialObjectInfos,
        materialRouterObjectInfo.id
      )
    }
  }

  loadInSceneObjectInfoList(gltf: GLTF) {
    for (const scene of gltf.scenes) {
      this.objectInfoStorage.createSceneObjectInfo(scene)
    }
  }

  loadCameraObjectInfoList(gltf: GLTF) {
    for (const cameraData of gltf.cameras) {
      this.objectInfoStorage.createCameraObjectInfo(cameraData)
    }
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
}

export default ObjectInfoStorageConfigLoader
