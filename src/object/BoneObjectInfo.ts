import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ObjectPath } from './ObjectInfo'
import { SystemValueType } from '../utils'

export const boneObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_BONE'),
  id: z.string(),
  sceneId: z.string(),
})

export type BoneObjectConfig = z.infer<typeof boneObjectConfigSchema>

export class BoneObjectInfo extends InSceneObjectInfo {
  readonly config: BoneObjectConfig
  readonly data: THREE.Bone
  readonly eventDispatcher: EventDispatcher<InSceneObjectInfoEvent>
  private boxHelper: THREE.BoxHelper | null = null

  constructor(
    data: THREE.Bone,
    sceneId: string,
    objectInfoStorage: ObjectInfoStorage
  ) {
    super(data, sceneId, objectInfoStorage)
    const actualId =
      data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG']?.id ?? uuidv4()
    this.config = {
      type: 'OBJECT_3D_BONE',
      id: actualId,
      sceneId,
    }
    data.userData['THREE_SCENE_STUDIO.OBJECT_CONFIG'] = this.config
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
}
