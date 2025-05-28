import * as THREE from 'three'
import { materialObjectInfoPropertyTypeDefinition } from './MaterialObjectInfo'
import { MapTypeDefinition } from '../property'
import { MeshStandardMaterialObjectInfo } from './MeshStandardMaterialObjectInfo'

export const meshDefaultStandardMaterialObjectInfoPropertyTypeDefinition: MapTypeDefinition =
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
      emissiveIntensity: { type: 'NUMBER' },
      // emissiveMap: Texture | null;
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

export class MeshDefaultStandardMaterialObjectInfo extends MeshStandardMaterialObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    meshDefaultStandardMaterialObjectInfoPropertyTypeDefinition

  constructor(data: THREE.MeshStandardMaterial) {
    super(data)
    data.userData['THREE_SCENE_STUDIO.DEFAULT_MATERIAL'] = true
  }
}
