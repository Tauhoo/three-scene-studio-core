import Switcher from '../utils/Switcher'
import {
  ObjectInfo,
  ObjectInfoEvent,
  objectInfoPropertyTypeDefinition,
} from './ObjectInfo'
import EventDispatcher from '../utils/EventDispatcher'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { CameraObjectInfo } from './camera/CameraObjectInfo'
import { MapTypeDefinition } from './property'

export const cameraSwitcherObjectConfigSchema = z.object({
  type: z.literal('CAMERA_SWITCHER'),
  id: z.string(),
})

export type CameraSwitcherObjectConfig = z.infer<
  typeof cameraSwitcherObjectConfigSchema
>

export type CameraSwitcherObjectInfoEvent = ObjectInfoEvent

const cameraSwitcherInfoPropertyTypeDefinition: MapTypeDefinition = {
  type: 'MAP',
  map: {
    ...objectInfoPropertyTypeDefinition.map,
    index: { type: 'NUMBER' },
  },
}
export class CameraSwitcherInfo extends ObjectInfo {
  propertyTypeDefinition: MapTypeDefinition =
    cameraSwitcherInfoPropertyTypeDefinition
  readonly config: CameraSwitcherObjectConfig
  readonly data: Switcher<CameraObjectInfo>
  readonly eventDispatcher: EventDispatcher<CameraSwitcherObjectInfoEvent>
  constructor(data: Switcher<CameraObjectInfo>, id?: string) {
    super()
    this.config = {
      type: 'CAMERA_SWITCHER',
      id: id ?? uuidv4(),
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }
}
