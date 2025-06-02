import * as THREE from 'three'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { MaterialObjectInfo } from './MaterialObjectInfo'

export const getMaterialObjectInfos = (
  mesh: THREE.Mesh,
  objectInfoStorage: ObjectInfoStorage
) => {
  const materialMap = new Map<THREE.Material, MaterialObjectInfo>()
  for (const materialInfo of objectInfoStorage.getMaterialObjectInfos()) {
    materialMap.set(materialInfo.data, materialInfo)
  }

  const defaultMaterialObjectInfo =
    objectInfoStorage.getDefaultStandardMaterialObjectInfo()

  if (Array.isArray(mesh.material)) {
    // list of materials
    let result: MaterialObjectInfo[] = []
    for (const material of mesh.material) {
      if (material.userData['THREE_SCENE_STUDIO.DEFAULT_MATERIAL'] === true) {
        result.push(defaultMaterialObjectInfo)
        continue
      }

      const materialInfo = materialMap.get(material)
      if (materialInfo !== undefined) {
        result.push(materialInfo)
      } else {
        result.push(defaultMaterialObjectInfo)
      }
    }
    return result
  } else {
    if (
      mesh.material.userData['THREE_SCENE_STUDIO.DEFAULT_MATERIAL'] === true
    ) {
      return defaultMaterialObjectInfo
    } else {
      // single material
      const materialInfo = materialMap.get(mesh.material)
      if (materialInfo !== undefined) {
        return materialInfo
      } else {
        return defaultMaterialObjectInfo
      }
    }
  }
}
