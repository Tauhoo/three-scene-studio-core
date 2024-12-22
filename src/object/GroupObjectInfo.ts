import * as THREE from 'three'
import * as z from 'zod'
import { ObjectInSceneInfo } from './ObjectInSceneInfo'
import { getChildren } from './children'

export const groupObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_GROUP'),
  id: z.number(),
  sceneId: z.number(),
})

export type GroupObjectReference = z.infer<typeof groupObjectReferenceSchema>

export class GroupObjectInfo extends ObjectInSceneInfo<
  GroupObjectReference,
  THREE.Group
> {
  constructor(data: THREE.Group, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_GROUP',
        id: data.id,
        sceneId: sceneId,
      },
      data,
      sceneId
    )
  }

  protected getChildren(
    data: THREE.Group,
    sceneId: number
  ): ObjectInSceneInfo[] {
    return getChildren(data, sceneId)
  }

  get name() {
    return this.data.name
  }
}
