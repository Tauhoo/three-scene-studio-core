import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'
import { getChildren } from './children'
import { ObjectInSceneInfo } from '.'

export const meshObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_MESH'),
  sceneId: z.number(),
  id: z.number(),
})

export type MeshObjectReference = z.infer<typeof meshObjectReferenceSchema>

export class MeshObjectInfo extends ObjectInfo<
  MeshObjectReference,
  THREE.Mesh
> {
  children: ObjectInSceneInfo[] = []
  constructor(data: THREE.Mesh, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_MESH',
        id: data.id,
        sceneId,
      },
      data
    )
    this.children = getChildren(data, sceneId)
  }

  get name() {
    return this.data.name
  }
}

export class MeshObjectInfoStorage extends DataStorage<
  MeshObjectReference,
  MeshObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
  }

  setNative(mesh: THREE.Mesh, sceneId: number) {
    const meshObjectInfo = new MeshObjectInfo(mesh, sceneId)
    this.set(meshObjectInfo.reference, meshObjectInfo)
  }

  setMultipleNative(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    scenes.forEach(scene => {
      scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          this.setNative(child, scene.id)
        }
      })
    })
  }
}
