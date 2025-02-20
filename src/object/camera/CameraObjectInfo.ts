import * as THREE from 'three'
import { ObjectInfo, ObjectInfoEvent, ObjectPath } from '../ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import EventDispatcher, { EventPacket } from '../../utils/EventDispatcher'

export const cameraObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_CAMERA'),
  id: z.string(),
})

export type CameraObjectConfig = z.infer<typeof cameraObjectConfigSchema>

export type CameraObjectInfoEvent =
  | EventPacket<'HELPER_CHANGE', { enabled: boolean }>
  | ObjectInfoEvent

export class CameraObjectInfo extends ObjectInfo {
  readonly config: CameraObjectConfig
  readonly data: THREE.Camera
  readonly eventDispatcher: EventDispatcher<CameraObjectInfoEvent>
  private cameraHelper: THREE.CameraHelper | null = null

  constructor(data: THREE.Camera, id?: string) {
    super()
    const actualId = id ?? uuidv4()
    data.userData['THREE_SCENE_STUDIO.OBJECT_INFO_ID'] = actualId
    this.config = {
      type: 'OBJECT_3D_CAMERA',
      id: actualId,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()

    const worldPosition = new THREE.Vector3()
    const worldQuaternion = new THREE.Quaternion()
    const worldScale = new THREE.Vector3()

    // detach from parent and update world matrix
    this.data.getWorldPosition(worldPosition)
    this.data.getWorldQuaternion(worldQuaternion)
    this.data.getWorldScale(worldScale)

    this.data.removeFromParent()

    this.data.position.copy(worldPosition)
    this.data.quaternion.copy(worldQuaternion)
    this.data.scale.copy(worldScale)
    this.data.updateMatrixWorld()
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    this.data.updateMatrix()
    this.data.updateMatrixWorld()
    if (this.cameraHelper !== null) {
      this.cameraHelper.update()
    }
    return result
  }

  helper(value: boolean) {
    if (value) {
      if (this.cameraHelper === null && this.data.parent !== null) {
        this.cameraHelper = new THREE.CameraHelper(this.data)
        this.data.parent.add(this.cameraHelper)
      }
    } else {
      if (this.cameraHelper !== null && this.cameraHelper.parent !== null) {
        this.cameraHelper.parent.remove(this.cameraHelper)
        this.cameraHelper = null
      }
    }
    this.eventDispatcher.dispatch('HELPER_CHANGE', {
      enabled: value,
    })
  }

  isHelperEnabled(): boolean {
    return this.data.children.length > 0
  }
}
