import * as THREE from 'three'
import {
  MaterialObjectInfo,
  materialObjectInfoPropertyTypeDefinition,
} from './MaterialObjectInfo'
import { MapTypeDefinition } from '../property'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { TextureObjectInfoMap } from './getTextureObjectInfo'

export const meshStandardMaterialObjectConfigSchema = z.object({
  type: z.literal('MESH_STANDARD_MATERIAL'),
  id: z.string(),
})

export type MeshStandardMaterialObjectConfig = z.infer<
  typeof meshStandardMaterialObjectConfigSchema
>

export const meshStandardMaterialObjectInfoPropertyTypeDefinition: MapTypeDefinition =
  {
    type: 'MAP',
    map: {
      ...materialObjectInfoPropertyTypeDefinition.map,
      color: { type: 'COLOR' },
      roughness: { type: 'NUMBER' },
      metalness: { type: 'NUMBER' },
      // map: Texture | null;
      // lightMap: Texture | null;
      lightMapIntensity: { type: 'NUMBER' },
      // aoMap: Texture | null;
      aoMapIntensity: { type: 'NUMBER' },
      emissive: { type: 'COLOR' },
      // emissiveMap: Texture | null;
      emissiveIntensity: { type: 'NUMBER' },
      // bumpMap: Texture | null;
      bumpScale: { type: 'NUMBER' },
      // normalMap: Texture | null;
      // normalMapType: NormalMapTypes;
      normalScale: { type: 'VECTOR_2D' },
      // displacementMap: Texture | null;
      displacementScale: { type: 'NUMBER' },
      displacementBias: { type: 'NUMBER' },
      // roughnessMap: Texture | null;
      // metalnessMap: Texture | null;
      // alphaMap: Texture | null;
      // envMap: Texture | null;
      // envMapRotation: Euler;
      envMapIntensity: { type: 'NUMBER' },
      wireframe: { type: 'BOOLEAN' },
      wireframeLinewidth: { type: 'NUMBER' },
      // wireframeLinecap: string;
      // wireframeLinejoin: string;
      flatShading: { type: 'BOOLEAN' },
      fog: { type: 'BOOLEAN' },
    },
  }

export const meshStandardMaterialMapKeys = [
  'map',
  'aoMap',
  'envMap',
  'bumpMap',
  'alphaMap',
  'lightMap',
  'normalMap',
  'emissiveMap',
  'roughnessMap',
  'metalnessMap',
  'displacementMap',
] as const
export class MeshStandardMaterialObjectInfo extends MaterialObjectInfo {
  readonly config: MeshStandardMaterialObjectConfig
  propertyTypeDefinition: MapTypeDefinition =
    meshStandardMaterialObjectInfoPropertyTypeDefinition
  declare readonly textureObjectInfoMap: TextureObjectInfoMap<
    typeof meshStandardMaterialMapKeys
  >

  constructor(
    data: THREE.MeshStandardMaterial,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, objectInfoStorage, meshStandardMaterialMapKeys)
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'MESH_STANDARD_MATERIAL',
      id: actualId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
  }
}
