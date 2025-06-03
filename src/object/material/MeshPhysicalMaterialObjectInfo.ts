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
      anisotropy: { type: 'NUMBER' },
      // clearcoatMap: Texture | null;
      clearcoat: { type: 'NUMBER' },
      // clearcoatRoughnessMap: Texture | null;
      clearcoatRoughness: { type: 'NUMBER' },
      // clearcoatNormalMap: Texture | null;
      clearcoatNormalScale: { type: 'VECTOR_2D' },
      ior: { type: 'NUMBER' },
      reflectivity: { type: 'NUMBER' },
      // iridescenceMap: Texture | null;
      iridescence: { type: 'NUMBER' },
      iridescenceIOR: { type: 'NUMBER' },
      // iridescenceThicknessMap: Texture | null;
      iridescenceThicknessRange: { type: 'VECTOR' },
      // sheenColorMap: Texture | null;
      sheenColor: { type: 'COLOR' },
      sheen: { type: 'NUMBER' },
      // sheenRoughnessMap: Texture | null;
      sheenRoughness: { type: 'NUMBER' },
      // transmissionMap: Texture | null;
      transmission: { type: 'NUMBER' },
      // thicknessMap: Texture | null;
      thickness: { type: 'NUMBER' },
      attenuationDistance: { type: 'NUMBER' },
      attenuationColor: { type: 'COLOR' },
      // specularIntensityMap: Texture | null;
      specularIntensity: { type: 'NUMBER' },
      // specularColorMap: Texture | null;
      specularColor: { type: 'COLOR' },
      dispersion: { type: 'NUMBER' },
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
