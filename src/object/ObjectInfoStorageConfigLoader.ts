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
  getMapKeysFromNative,
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
    this.loadTextureObjectInfoList(gltf)
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

  loadTextureObjectInfoList(gltf: GLTF) {
    const textureSet = new Set<THREE.Texture>()
    for (const scene of gltf.scenes) {
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.material instanceof THREE.Material) {
            const material: any = object.material
            const mapKeys = getMapKeysFromNative(material)
            for (const key of mapKeys) {
              const texture = material[key]
              if (texture instanceof THREE.Texture) {
                textureSet.add(texture)
              }
            }
          }
        }
      })
    }

    for (const texture of textureSet) {
      this.objectInfoStorage.createTextureObjectInfo(texture)
    }
  }

  loadMaterialObjectInfoList(gltf: GLTF) {
    const materialSet = new Set<THREE.Material>()
    for (const scene of gltf.scenes) {
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          materialSet.add(object.material)
        }
      })
    }

    for (const material of materialSet) {
      this.objectInfoStorage.createMaterialObjectInfo(material)
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
