import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from '../children'
import { InSceneObjectInfo } from '../InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'

export const lightObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_LIGHT'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type LightObjectConfig = z.infer<typeof lightObjectConfigSchema>

export class LightObjectInfo extends InSceneObjectInfo {
  readonly config: LightObjectConfig
  readonly data: THREE.Light
  readonly children: InSceneObjectInfo[]

  constructor(data: THREE.Light, sceneId: number, id?: string) {
    super()
    this.config = {
      type: 'OBJECT_3D_LIGHT',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.children = getChildren(this.data, this.config.sceneId)
  }

  get name() {
    return this.data.name
  }
}
