import * as THREE from 'three'
import { AmbientLightObjectInfo } from './AmbientLightObjectInfo'
import { HemisphereLightObjectInfo } from './HemisphereLightObjectInfo'
import { DirectionalLightObjectInfo } from './DirectionalLightObjectInfo'
import { PointLightObjectInfo } from './PointLightObjectInfo'
import { RectAreaLightObjectInfo } from './RectAreaLightObjectInfo'
import { SpotLightObjectInfo } from './SpotLightObjectInfo'
import { ObjectInfoStorage } from '../ObjectInfoStorage'

export function createLightObjectFromNative(
  light: THREE.Light,
  objectInfoStorage: ObjectInfoStorage,
  sceneId: number,
  id?: string
) {
  if (light instanceof THREE.AmbientLight) {
    const result = new AmbientLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else if (light instanceof THREE.DirectionalLight) {
    const result = new DirectionalLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else if (light instanceof THREE.HemisphereLight) {
    const result = new HemisphereLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else if (light instanceof THREE.PointLight) {
    const result = new PointLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else if (light instanceof THREE.RectAreaLight) {
    const result = new RectAreaLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else if (light instanceof THREE.SpotLight) {
    const result = new SpotLightObjectInfo(
      light,
      sceneId,
      objectInfoStorage,
      id
    )
    return result
  } else {
    throw new Error('Invalid light type')
  }
}
