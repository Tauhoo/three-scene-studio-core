import * as THREE from 'three'
import { ObjectInfo } from '../ObjectInfo'
import DataStorage from '../../utils/DataStorage'
import * as z from 'zod'

export const cameraObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_CAMERA'),
  id: z.number(),
})

export type CameraObjectReference = z.infer<typeof cameraObjectReferenceSchema>

export class CameraObjectInfo extends ObjectInfo<
  CameraObjectReference,
  THREE.Camera
> {
  constructor(data: THREE.Camera) {
    super(
      {
        type: 'OBJECT_3D_CAMERA',
        id: data.id,
      },
      data
    )
  }

  get name() {
    return this.data.name
  }

  set name(value: string) {
    this.data.name = value
  }

  onChangeValue() {
    this.data.updateMatrix()
    this.data.updateMatrixWorld()
  }
}

export class CameraObjectInfoStorage extends DataStorage<
  CameraObjectReference,
  CameraObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
  }

  setNative(camera: THREE.Camera) {
    const cameraObjectInfo = new CameraObjectInfo(camera)
    this.set(cameraObjectInfo.reference, cameraObjectInfo)
  }

  setMultipleNative(cameras: THREE.Camera[]) {
    cameras.forEach(camera => {
      this.setNative(camera)
    })
  }
}
