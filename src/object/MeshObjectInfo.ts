import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ObjectPath } from './ObjectInfo'
import { SystemValueType } from '../utils'
import {
  materialOwnerObjectConfigSchema,
  MaterialOwnerObjectInfo,
  MaterialOwnerObjectInfoEvent,
  MaterialRouterObjectInfoIds,
} from './MaterialOwnerObjectInfo'

export const meshObjectConfigSchema = materialOwnerObjectConfigSchema.extend({
  type: z.literal('OBJECT_3D_MESH'),
})

export type MeshObjectConfig = z.infer<typeof meshObjectConfigSchema>
export class MeshObjectInfo extends MaterialOwnerObjectInfo {
  readonly config: MeshObjectConfig
  readonly eventDispatcher: EventDispatcher<MaterialOwnerObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null
  data: THREE.Mesh

  constructor(
    data: THREE.Mesh,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, sceneId, objectInfoStorage)
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'OBJECT_3D_MESH',
      id: actualId,
      sceneId,
      materialRouterObjectInfoIds: this.getMaterialRouterObjectInfoIds(),
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
    this.eventDispatcher = new EventDispatcher()
    this.data = data
  }

  setValue(objectPath: ObjectPath, value: any, valueType?: SystemValueType) {
    const result = super.setValue(objectPath, value, valueType)
    if (this.boxHelper !== null) {
      this.boxHelper.update()
    }
    return result
  }

  helper(value: boolean) {
    if (value) {
      if (this.boxHelper === null && this.data.parent !== null) {
        this.boxHelper = new THREE.BoxHelper(this.data)
        this.boxHelper.update()
        this.data.traverseAncestors(object => {
          if (object instanceof THREE.Scene && this.boxHelper !== null) {
            object.add(this.boxHelper)
          }
        })
      }
    } else {
      if (this.boxHelper !== null && this.boxHelper.parent !== null) {
        this.boxHelper.parent.remove(this.boxHelper)
        this.boxHelper = null
      }
    }
    super.helper(value)
  }

  destroy(): void {
    if (this.boxHelper) {
      this.helper(false)
    }
    this.data.geometry.dispose()
    super.destroy()
  }
}
