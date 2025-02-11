import * as THREE from 'three'
import * as z from 'zod'
import { getChildren } from './children'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ErrorResponse, SuccessResponse } from '../utils'
import { ObjectPath } from './ObjectInfo'

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
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null

  constructor(
    data: THREE.Mesh,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_MESH',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
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
        this.data.parent.add(this.boxHelper)
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
    super.destroy()
  }
}
