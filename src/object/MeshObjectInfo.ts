import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ObjectPath } from './ObjectInfo'
import { SystemValueType } from '../utils'
import { MaterialObjectInfo } from './material'
import { getMaterialObjectInfos } from './material/getMeshMaterialObject'

export const meshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_MESH'),
  id: z.string(),
  sceneId: z.string(),
})

export type MeshObjectConfig = z.infer<typeof meshObjectConfigSchema>

export class MeshObjectInfo extends InSceneObjectInfo {
  readonly config: MeshObjectConfig
  readonly data: THREE.Mesh
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null
  readonly material: MaterialObjectInfo | null | (MaterialObjectInfo | null)[]

  constructor(
    data: THREE.Mesh,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, sceneId, objectInfoStorage)

    this.material = getMaterialObjectInfos(data, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_MESH',
      id: actualId,
      sceneId,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
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
    if (Array.isArray(this.data.material)) {
      for (const material of this.data.material) {
        material.dispose()
      }
    } else {
      this.data.material.dispose()
    }
    super.destroy()
  }
}
