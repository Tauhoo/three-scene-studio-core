import * as THREE from 'three'
import {
  MaterialObjectInfo,
  materialObjectInfoPropertyTypeDefinition,
} from './MaterialObjectInfo'
import { MapTypeDefinition } from '../property'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { TextureObjectInfo } from '../TextureObjectInfo'
import { TextureObjectInfoMap } from './getTextureObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export const meshBasicMaterialObjectConfigSchema = z.object({
  type: z.literal('MESH_BASIC_MATERIAL'),
  id: z.string(),
})

export type MeshBasicMaterialObjectConfig = z.infer<
  typeof meshBasicMaterialObjectConfigSchema
>

const meshBasicMaterialObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...materialObjectInfoPropertyTypeDefinition.map,
    color: { type: 'COLOR' },
    // map: Texture | null;

    // lightMap: Texture | null;
    lightMapIntensity: { type: 'NUMBER' },

    // aoMap: Texture | null;
    aoMapIntensity: { type: 'NUMBER' },

    // specularMap: Texture | null;
    // alphaMap: Texture | null;

    // envMap: Texture | null;
    envMapRotation: { type: 'VECTOR_3D' },

    // combine: Combine;
    reflectivity: { type: 'NUMBER' },
    refractionRatio: { type: 'NUMBER' },
    wireframe: { type: 'BOOLEAN' },
    wireframeLinewidth: { type: 'NUMBER' },
    // wireframeLinecap: string;
    // wireframeLinejoin: string;
    fog: { type: 'BOOLEAN' },
  },
}

export type MeshBasicMaterialTextureObjectInfos = {
  map: TextureObjectInfo | null
  aoMap: TextureObjectInfo | null
  envMap: TextureObjectInfo | null
  alphaMap: TextureObjectInfo | null
  lightMap: TextureObjectInfo | null
  specularMap: TextureObjectInfo | null
}

export const meshBasicMaterialMapKeys = [
  'map',
  'aoMap',
  'envMap',
  'alphaMap',
  'lightMap',
  'specularMap',
] as const

export class MeshBasicMaterialObjectInfo extends MaterialObjectInfo {
  readonly config: MeshBasicMaterialObjectConfig
  propertyTypeDefinition: MapTypeDefinition =
    meshBasicMaterialObjectInfoPropertyTypeDefinition
  declare readonly textureObjectInfoMap: TextureObjectInfoMap<
    typeof meshBasicMaterialMapKeys
  >

  constructor(
    data: THREE.MeshBasicMaterial,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, objectInfoStorage, meshBasicMaterialMapKeys)
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'MESH_BASIC_MATERIAL',
      id: actualId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
  }
}
