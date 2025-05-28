import * as THREE from 'three'
import { MaterialObjectInfo } from './MaterialObjectInfo'
import { MapTypeDefinition } from '../property'
import {
  MeshStandardMaterialObjectInfo,
  meshStandardMaterialObjectInfoPropertyTypeDefinition,
} from './MeshStandardMaterialObjectInfo'

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

export class MeshPhysicalMaterialObjectInfo extends MeshStandardMaterialObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    meshPhysicalMaterialObjectInfoPropertyTypeDefinition

  constructor(data: THREE.MeshPhysicalMaterial) {
    super(data)
  }
}
