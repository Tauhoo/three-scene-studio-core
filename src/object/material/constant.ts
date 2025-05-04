import { MeshStandardMaterial } from 'three'

export const defaultMaterial = new MeshStandardMaterial({
  name: 'Default',
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.5,
})
