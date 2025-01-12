import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'

export const meshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_MESH'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type MeshObjectConfig = z.infer<typeof meshObjectConfigSchema>

export class MeshObjectInfo extends InSceneObjectInfo {
  readonly config: MeshObjectConfig
  readonly data: THREE.Mesh
  readonly children: InSceneObjectInfo[]

  constructor(data: THREE.Mesh, sceneId: number, id?: string) {
    super()
    this.config = {
      type: 'OBJECT_3D_MESH',
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
