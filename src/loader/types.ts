import * as THREE from 'three'

export type AnimationLoadedInfo = {
  id: string
  type: 'ANIMATION'
  name: string
  data: THREE.AnimationClip
}

export type CameraLoadedInfo = {
  id: string
  type: 'CAMERA'
  name: string
  data: THREE.Camera
}

// In scene object

export type SceneLoadedInfo = {
  id: string
  type: 'SCENE'
  name: string
  data: THREE.Group
  children: InSceneLoadedInfo[]
}

export type InSceneLoadedInfo =
  | GroupLoadedInfo
  | MeshLoadedInfo
  | LightLoadedInfo
  | SkinMeshLoadedInfo
  | BoneLoadedInfo

export type GroupLoadedInfo = {
  id: string
  type: 'GROUP'
  name: string
  data: THREE.Object3D
  children: InSceneLoadedInfo[]
}

export type MeshLoadedInfo = {
  id: string
  type: 'MESH'
  name: string
  data: THREE.Mesh
  children: InSceneLoadedInfo[]
}

export type LightLoadedInfo = {
  id: string
  type: 'LIGHT'
  name: string
  data: THREE.Light
  children: InSceneLoadedInfo[]
}

export type SkinMeshLoadedInfo = {
  id: string
  type: 'SKIN_MESH'
  name: string
  data: THREE.SkinnedMesh
  children: InSceneLoadedInfo[]
}

export type BoneLoadedInfo = {
  id: string
  type: 'BONE'
  name: string
  data: THREE.Bone
  children: InSceneLoadedInfo[]
}

export type MaterialLoadedInfo = {
  id: string
  type: 'MATERIAL'
  name: string
  data: THREE.Material
}

export type TextureLoadedInfo = {
  id: string
  type: 'TEXTURE'
  name: string
  data: THREE.Texture
}

export const loadedInfoType = [
  'ANIMATION',
  'CAMERA',
  'SCENE',
  'GROUP',
  'MESH',
  'LIGHT',
  'SKIN_MESH',
  'BONE',
  'MATERIAL',
] as const

export type LoadedInfoType = (typeof loadedInfoType)[number]
