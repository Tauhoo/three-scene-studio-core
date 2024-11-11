import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import * as z from 'zod'
import { LightObjectInfo } from './LightObjectInfo'
import { MeshObjectInfo } from './MeshObjectInfo'
import { ObjectInSceneInfo } from '.'

export const groupObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_GROUP'),
  id: z.number(),
  sceneId: z.number(),
})

export type GroupObjectReference = z.infer<typeof groupObjectReferenceSchema>

export class GroupObjectInfo extends ObjectInfo<
  GroupObjectReference,
  THREE.Group
> {
  readonly children: ObjectInSceneInfo[] = []
  constructor(data: THREE.Group, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_GROUP',
        id: data.id,
        sceneId: sceneId,
      },
      data
    )
    this.children = getChildren(data, sceneId)
  }
}

export const getChildren = (
  data: THREE.Group | THREE.Scene,
  sceneId: number
): ObjectInSceneInfo[] => {
  return data.children
    .map(child => {
      if (child instanceof THREE.Mesh) {
        return new MeshObjectInfo(child, sceneId)
      }
      if (child instanceof THREE.Group) {
        return new GroupObjectInfo(child, sceneId)
      }
      if (child instanceof THREE.Light) {
        return new LightObjectInfo(child, sceneId)
      }
    })
    .filter(child => child !== undefined)
}
