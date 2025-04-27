import * as THREE from 'three'
import * as z from 'zod'
import {
  InSceneObjectInfo,
  InSceneObjectInfoEvent,
  inSceneObjectInfoPropertyTypeDefinition,
} from '../InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from '../ObjectInfoStorage'
import EventDispatcher from '../../utils/EventDispatcher'
import { MapTypeDefinition } from '../property'

export const lightObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_LIGHT'),
  id: z.string(),
  sceneId: z.string(),
})

export type LightObjectConfig = z.infer<typeof lightObjectConfigSchema>

const lightObjectInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...inSceneObjectInfoPropertyTypeDefinition.map,
    intensity: { type: 'NUMBER' },
  },
}
export class LightObjectInfo extends InSceneObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    lightObjectInfoPropertyTypeDefinition
  readonly config: LightObjectConfig
  readonly data: THREE.Light
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>

  constructor(
    data: THREE.Light,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, sceneId, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_LIGHT',
      id: actualId,
      sceneId,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }
}
