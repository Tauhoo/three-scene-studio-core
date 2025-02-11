import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from '../children'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from '../InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import EventDispatcher from '../../utils/EventDispatcher'

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
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.Light,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_LIGHT',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }
}
