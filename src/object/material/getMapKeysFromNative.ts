import * as THREE from 'three'
import { meshPhysicalMaterialMapKeys } from './MeshPhysicalMaterialObjectInfo'
import { meshBasicMaterialMapKeys } from './MeshBasicMaterialObjectInfo'
import { meshStandardMaterialMapKeys } from './MeshStandardMaterialObjectInfo'

export function getMapKeysFromNative(material: THREE.Material) {
  if (material instanceof THREE.MeshPhysicalMaterial) {
    return meshPhysicalMaterialMapKeys
  }

  if (material instanceof THREE.MeshBasicMaterial) {
    return meshBasicMaterialMapKeys
  }

  if (material instanceof THREE.MeshStandardMaterial) {
    return meshStandardMaterialMapKeys
  }

  return []
}
