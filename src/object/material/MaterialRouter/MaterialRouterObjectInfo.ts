import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { MaterialObjectInfo } from '../MaterialObjectInfo'
import { ObjectInfo, ObjectInfoEvent } from '../../ObjectInfo'
import EventDispatcher from '../../../utils/EventDispatcher'
import { MeshDefaultStandardMaterialObjectInfo } from '../MeshDefaultStandardMaterialObjectInfo'
import { MaterialRouterData } from './MaterialRouterData'

export const MaterialRouterObjectInfoConfigSchema = z.object({
  type: z.literal('MATERIAL_ROUTER'),
  id: z.string(),
  name: z.string(),
  materialIds: z.array(z.string().nullable()),
})

export type MaterialRouterObjectInfoConfig = z.infer<
  typeof MaterialRouterObjectInfoConfigSchema
>

export class MaterialRouterObjectInfo extends ObjectInfo {
  eventDispatcher: EventDispatcher<ObjectInfoEvent>
  config: MaterialRouterObjectInfoConfig
  data: MaterialRouterData
  constructor(name: string, data: MaterialObjectInfo[], id?: string) {
    super()
    this.config = {
      type: 'MATERIAL_ROUTER',
      id: id ?? uuidv4(),
      name,
      materialIds: data.map(material =>
        material instanceof MeshDefaultStandardMaterialObjectInfo
          ? null
          : material.config.id
      ),
    }
    this.data = new MaterialRouterData(name, data)
    this.eventDispatcher = new EventDispatcher()
  }
}
