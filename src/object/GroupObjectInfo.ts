import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import * as z from 'zod'
import { ObjectInSceneInfo } from '.'
import { getChildren } from './children'

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
  children: ObjectInSceneInfo[] = []
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

  get name() {
    return this.data.name
  }
}
