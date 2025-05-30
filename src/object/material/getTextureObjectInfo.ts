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
  const textureObjectInfoMap = Object.fromEntries(
    objectInfoStorage
      .getTextureObjectInfos()
      .map(value => [value.config.id, value])
  )
  let result: any = {}
  for (const key of mapKeys) {
    const value = (material as any)[key]
    if (value instanceof THREE.Texture) {
      const textureObjectInfo =
        textureObjectInfoMap[
          value.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id
        ]
      if (!textureObjectInfo) {
        result[key] = objectInfoStorage.createTextureObjectInfo(value)
      } else {
        result[key] = textureObjectInfo
      }
    } else {
      result[key] = null
    }
  }
  return result as TextureObjectInfoMap<K>
}
