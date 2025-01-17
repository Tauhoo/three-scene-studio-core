import * as THREE from 'three'
import { ObjectInfo, ObjectPath } from '../ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const cameraObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_CAMERA'),
  id: z.string(),
  cameraId: z.number(),
})

export type CameraObjectConfig = z.infer<typeof cameraObjectConfigSchema>

export class CameraObjectInfo extends ObjectInfo {
  readonly config: CameraObjectConfig
  readonly data: THREE.Camera

  constructor(data: THREE.Camera, id?: string) {
    super()
    this.config = {
      type: 'OBJECT_3D_CAMERA',
      id: id ?? uuidv4(),
      cameraId: data.id,
    }
    this.data = data
  }

  get name() {
    return this.data.name
  }

  set name(value: string) {
    this.data.name = value
  }

  setValue(objectPath: ObjectPath, value: any) {
    this.data.updateMatrix()
    this.data.updateMatrixWorld()
    return super.setValue(objectPath, value)
  }
}
