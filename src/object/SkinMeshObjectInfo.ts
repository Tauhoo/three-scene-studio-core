import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'

export const skinMeshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_SKIN_MESH'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type SkinMeshObjectConfig = z.infer<typeof skinMeshObjectConfigSchema>

export class SkinMeshObjectInfo extends InSceneObjectInfo {
  readonly config: SkinMeshObjectConfig
  readonly data: THREE.SkinnedMesh
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.SkinnedMesh,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_SKIN_MESH',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }

  get name() {
    return this.data.name
  }
}
