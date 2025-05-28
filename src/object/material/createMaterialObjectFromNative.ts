import * as THREE from 'three'
import { MeshStandardMaterialObjectInfo } from './MeshStandardMaterialObjectInfo'
import { MeshBasicMaterialObjectInfo } from './MeshBasicMaterialObjectInfo'
import { MeshPhysicalMaterialObjectInfo } from './MeshPhysicalMaterialObjectInfo'

export function createMaterialObjectInfoFromNative(material: THREE.Material) {
  if (material instanceof THREE.MeshPhysicalMaterial) {
    const result = new MeshPhysicalMaterialObjectInfo(material)
    return result
  }

  if (material instanceof THREE.MeshBasicMaterial) {
    const result = new MeshBasicMaterialObjectInfo(material)
    return result
  }

  if (material instanceof THREE.MeshStandardMaterial) {
    const result = new MeshStandardMaterialObjectInfo(material)
    return result
  }

  throw new Error('Invalid light type')
}
