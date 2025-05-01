import * as THREE from 'three'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { MeshStandardMaterialObjectInfo } from './MeshStandardMaterialObjectInfo'
import { MeshBasicMaterialObjectInfo } from './MeshBasicMaterialObjectInfo'
import { MeshPhysicalMaterialObjectInfo } from './MeshPhysicalMaterialObjectInfo'

export function createMaterialObjectInfoFromNative(
  material: THREE.Material,
  id?: string
) {
  if (material instanceof THREE.MeshPhysicalMaterial) {
    const result = new MeshPhysicalMaterialObjectInfo(material, id)
    return result
  }

  if (material instanceof THREE.MeshBasicMaterial) {
    const result = new MeshBasicMaterialObjectInfo(material, id)
    return result
  }

  if (material instanceof THREE.MeshStandardMaterial) {
    const result = new MeshStandardMaterialObjectInfo(material, id)
    return result
  }

  throw new Error('Invalid light type')
}
