import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
export const groupObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_GROUP'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type GroupObjectConfig = z.infer<typeof groupObjectConfigSchema>

export class GroupObjectInfo extends InSceneObjectInfo {
  readonly config: GroupObjectConfig
  readonly data: THREE.Object3D
  readonly children: InSceneObjectInfo[]

  constructor(
    data: THREE.Object3D,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super()
    this.config = {
      type: 'OBJECT_3D_GROUP',
      id: id ?? uuidv4(),
      sceneId: sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.children = getChildren(this.data, sceneId, objectInfoStorage)
  }

  get name() {
    return this.data.name
  }
}
