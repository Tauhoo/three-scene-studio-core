import * as THREE from 'three'
import { MapTypeDefinition } from '../property'
import { meshStandardMaterialObjectInfoPropertyTypeDefinition } from './MeshStandardMaterialObjectInfo'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { MaterialObjectInfo } from './MaterialObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import { TextureObjectInfoMap } from './getTextureObjectInfo'

export const meshPhysicalMaterialObjectConfigSchema = z.object({
  type: z.literal('MESH_PHYSICAL_MATERIAL'),
  id: z.string(),
})

export type MeshPhysicalMaterialObjectConfig = z.infer<
  typeof meshPhysicalMaterialObjectConfigSchema
>

const meshPhysicalMaterialObjectInfoPropertyTypeDefinition: MapTypeDefinition =
  {
    type: 'MAP',
    map: {
      ...meshStandardMaterialObjectInfoPropertyTypeDefinition.map,
      // anisotropyRotation?: number;
      // anisotropyMap?: Texture | null;
      // clearcoatMap: Texture | null;
      clearcoatRoughness: { type: 'NUMBER' },
      // clearcoatRoughnessMap: Texture | null;
      clearcoatNormalScale: { type: 'VECTOR_2D' },
      // clearcoatNormalMap: Texture | null;
      ior: { type: 'NUMBER' },
      reflectivity: { type: 'NUMBER' },
      // iridescenceMap: Texture | null;
      iridescenceIOR: { type: 'NUMBER' },
      iridescenceThicknessRange: { type: 'VECTOR' },
      // iridescenceThicknessMap: Texture | null;
      sheenColor: { type: 'COLOR' },
      // sheenColorMap: Texture | null;
      sheenRoughness: { type: 'NUMBER' },
      // sheenRoughnessMap: Texture | null;
      // transmissionMap: Texture | null;
      thickness: { type: 'NUMBER' },
      // thicknessMap: Texture | null;
      attenuationDistance: { type: 'NUMBER' },
      attenuationColor: { type: 'COLOR' },
      specularIntensity: { type: 'NUMBER' },
      // specularIntensityMap: Texture | null;
      specularColor: { type: 'COLOR' },
      // specularColorMap: Texture | null;
      anisotropy: { type: 'NUMBER' },
      clearcoat: { type: 'NUMBER' },
      iridescence: { type: 'NUMBER' },
      dispersion: { type: 'NUMBER' },
      sheen: { type: 'NUMBER' },
      transmission: { type: 'NUMBER' },
    },
  }

export const meshPhysicalMaterialMapKeys = [
  'map',
  'aoMap',
  'envMap',
  'bumpMap',
  'alphaMap',
  'lightMap',
  'normalMap',
  'emissiveMap',
  'clearcoatMap',
  'roughnessMap',
  'thicknessMap',
  'metalnessMap',
  'anisotropyMap',
  'sheenColorMap',
  'iridescenceMap',
  'displacementMap',
  'transmissionMap',
  'specularColorMap',
  'sheenRoughnessMap',
  'clearcoatNormalMap',
  'specularIntensityMap',
  'clearcoatRoughnessMap',
  'iridescenceThicknessMap',
] as const
export class MeshPhysicalMaterialObjectInfo extends MaterialObjectInfo {
  readonly config: MeshPhysicalMaterialObjectConfig
  propertyTypeDefinition: MapTypeDefinition =
    meshPhysicalMaterialObjectInfoPropertyTypeDefinition
  declare readonly textureObjectInfoMap: TextureObjectInfoMap<
    typeof meshPhysicalMaterialMapKeys
  >

  constructor(
    data: THREE.MeshPhysicalMaterial,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, objectInfoStorage, meshPhysicalMaterialMapKeys)
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'MESH_PHYSICAL_MATERIAL',
      id: actualId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
  }
}
