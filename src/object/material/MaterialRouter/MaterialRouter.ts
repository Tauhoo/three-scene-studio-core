import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { MaterialObjectInfo } from '../MaterialObjectInfo'
import { ObjectInfo, ObjectInfoEvent } from '../../ObjectInfo'
import MaterialRouterData from './MaterialRouterData'
import EventDispatcher from '../../../utils/EventDispatcher'
import { MeshDefaultStandardMaterialObjectInfo } from '../MeshDefaultStandardMaterialObjectInfo'

export const materialRouterConfigSchema = z.object({
  type: z.literal('MATERIAL_ROUTER'),
  id: z.string(),
  name: z.string(),
  materialIds: z.array(z.string().nullable()),
})

export type MaterialRouterConfig = z.infer<typeof materialRouterConfigSchema>

class MaterialRouter extends ObjectInfo {
  eventDispatcher: EventDispatcher<ObjectInfoEvent>
  config: MaterialRouterConfig
  data: MaterialRouterData
  constructor(name: string, data: MaterialObjectInfo[]) {
    super()
    this.config = {
      type: 'MATERIAL_ROUTER',
      id: uuidv4(),
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

export default MaterialRouter
