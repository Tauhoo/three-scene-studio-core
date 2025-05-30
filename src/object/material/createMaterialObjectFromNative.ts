import * as THREE from 'three'
import { MeshStandardMaterialObjectInfo } from './MeshStandardMaterialObjectInfo'
import { MeshBasicMaterialObjectInfo } from './MeshBasicMaterialObjectInfo'
import { MeshPhysicalMaterialObjectInfo } from './MeshPhysicalMaterialObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export function createMaterialObjectInfoFromNative(
  material: THREE.Material,
  objectInfoStorage: ObjectInfoStorage
) {
  if (material instanceof THREE.MeshPhysicalMaterial) {
    const result = new MeshPhysicalMaterialObjectInfo(
      material,
      objectInfoStorage
    )
    return result
  }

  if (material instanceof THREE.MeshBasicMaterial) {
    const result = new MeshBasicMaterialObjectInfo(material, objectInfoStorage)
    return result
  }

  if (material instanceof THREE.MeshStandardMaterial) {
    const result = new MeshStandardMaterialObjectInfo(
      material,
      objectInfoStorage
    )
    return result
  }

  throw new Error('Invalid light type')
}
