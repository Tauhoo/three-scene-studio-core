import { ObjectInfoStorage } from '../ObjectInfoStorage'
import * as THREE from 'three'
import { TextureObjectInfo } from '../TextureObjectInfo'

export type TextureObjectInfoMap<
  K extends readonly string[] = readonly string[]
> = Record<K[number], TextureObjectInfo | null>

export function getTextureObjectInfo<K extends readonly string[]>(
  objectInfoStorage: ObjectInfoStorage,
  material: THREE.Material,
  mapKeys: K
) {
  const textureObjectInfoMap: Map<THREE.Texture, TextureObjectInfo> = new Map()
  for (const value of objectInfoStorage.getTextureObjectInfos()) {
    textureObjectInfoMap.set(value.data, value)
  }
  let result: any = {}
  for (const key of mapKeys) {
    const value = (material as any)[key]

    const textureObjectInfo = textureObjectInfoMap.get(value)
    if (textureObjectInfo) {
      result[key] = textureObjectInfo
    } else {
      result[key] = null
      ;(material as any)[key] = null
    }
  }
  return result as TextureObjectInfoMap<K>
}
