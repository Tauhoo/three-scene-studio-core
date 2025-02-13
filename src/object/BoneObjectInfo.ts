import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher from '../utils/EventDispatcher'
import { ObjectPath } from './ObjectInfo'

export const boneObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_BONE'),
  id: z.string(),
  sceneId: z.string(),
  childrenIds: z.array(z.string()),
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
    objectInfoStorage: ObjectInfoStorage,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, sceneId, objectInfoStorage, children)
    this.config = {
      type: 'OBJECT_3D_BONE',
      id: actualId,
      sceneId,
      childrenIds: this.children.map(child => child.config.id),
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
}
