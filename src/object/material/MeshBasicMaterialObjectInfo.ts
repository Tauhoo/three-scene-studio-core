import * as THREE from 'three'
import {
  MaterialObjectInfo,
  materialObjectInfoPropertyTypeDefinition,
} from './MaterialObjectInfo'
import { MapTypeDefinition } from '../property'

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

export class MeshBasicMaterialObjectInfo extends MaterialObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    meshBasicMaterialObjectInfoPropertyTypeDefinition

  constructor(data: THREE.MeshBasicMaterial, id?: string) {
    super(data, id)
  }
}
