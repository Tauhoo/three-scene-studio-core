import Switcher from '../utils/Switcher'
import { ObjectInfo, ObjectInfoEvent } from './ObjectInfo'
import {
  SceneObjectConfig,
  SceneObjectInfo,
  SceneObjectInfoEvent,
} from './SceneObjectInfo'
import EventDispatcher from '../utils/EventDispatcher'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const sceneSwitcherObjectConfigSchema = z.object({
  type: z.literal('SCENE_SWITCHER'),
  id: z.string(),
})

export type SceneSwitcherObjectConfig = z.infer<
  typeof sceneSwitcherObjectConfigSchema
>

export type SceneSwitcherObjectInfoEvent = ObjectInfoEvent

export class SceneSwitcherInfo extends ObjectInfo {
  readonly config: SceneSwitcherObjectConfig
  readonly data: Switcher<SceneObjectInfo>
  readonly eventDispatcher: EventDispatcher<SceneObjectInfoEvent>
  constructor(data: Switcher<SceneObjectInfo>) {
    super()
    this.config = {
      type: 'SCENE_SWITCHER',
      id: uuidv4(),
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }
}
