import * as THREE from 'three'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { MaterialObjectInfo } from './MaterialObjectInfo'
import { defaultMaterial } from './constant'

export const getMaterialObjectInfos = (
  mesh: THREE.Mesh,
  objectInfoStorage: ObjectInfoStorage
) => {
  const materialMap = new Map<THREE.Material, MaterialObjectInfo>()
  for (const materialInfo of objectInfoStorage.getMaterialObjectInfos()) {
    materialMap.set(materialInfo.data, materialInfo)
  }
  if (Array.isArray(mesh.material)) {
    // list of materials
    let result: (MaterialObjectInfo | null)[] = []
    for (const material of mesh.material) {
      if (material === defaultMaterial) {
        result.push(null)
        continue
      }

      const materialInfo = materialMap.get(material)
      if (materialInfo !== undefined) {
        result.push(materialInfo)
      } else {
        result.push(objectInfoStorage.createMaterialObjectInfo(material))
      }
    }
    return result
  } else {
    if (mesh.material === defaultMaterial) {
      return null
    } else {
      // single material
      const materialInfo = materialMap.get(mesh.material)
      if (materialInfo !== undefined) {
        return materialInfo
      } else {
        return objectInfoStorage.createMaterialObjectInfo(mesh.material)
      }
    }
  }
}
