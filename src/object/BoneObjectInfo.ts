import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'

export const boneObjectConfigSchema = z.object({
  type: z.literal('BONE'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type BoneObjectConfig = z.infer<typeof boneObjectConfigSchema>

export class BoneObjectInfo extends InSceneObjectInfo {
  readonly config: BoneObjectConfig
  readonly data: THREE.Bone
  readonly children: InSceneObjectInfo[]

  constructor(
    data: THREE.Bone,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super()
    this.config = {
      type: 'BONE',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.children = getChildren(this.data, sceneId, objectInfoStorage)
  }

  get name() {
    return this.data.name
  }
}
