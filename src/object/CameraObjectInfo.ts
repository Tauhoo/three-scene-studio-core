import * as THREE from 'three'
import { ObjectInfo } from './ObjectInfo'
import DataStorage from '../utils/DataStorage'
import * as z from 'zod'

export const cameraObjectReferenceSchema = z.object({
  type: z.literal('OBJECT_3D_CAMERA'),
  id: z.number(),
})

export type CameraObjectReference = z.infer<typeof cameraObjectReferenceSchema>

export type SharedCameraInfo = {
  name: string
  near: number
  far: number
}

export type PerspectiveCameraInfo = {
  type: 'perspective'
  fov: number
  aspect: number
}

export type OrthographicCameraInfo = {
  type: 'orthographic'
  width: number
  height: number
}

export type CameraInfo = SharedCameraInfo &
  (PerspectiveCameraInfo | OrthographicCameraInfo)

export class CameraObjectInfo extends ObjectInfo<
  CameraObjectReference,
  THREE.Camera
> {
  static fromInfo(info: CameraInfo) {
    let camera: THREE.Camera
    if (info.type === 'perspective') {
      camera = new THREE.PerspectiveCamera(
        info.fov,
        info.aspect,
        info.near,
        info.far
      )
    } else {
      camera = new THREE.OrthographicCamera(
        -info.width / 2,
        info.width / 2,
        info.height / 2,
        -info.height / 2,
        info.near,
        info.far
      )
    }
    const result = new CameraObjectInfo(camera)
    result.name = info.name
    return result
  }
  constructor(data: THREE.Camera) {
    super(
      {
        type: 'OBJECT_3D_CAMERA',
        id: data.id,
      },
      data
    )
    THREE.PerspectiveCamera
    THREE.OrthographicCamera
  }

  get name() {
    return this.data.name
  }

  set name(value: string) {
    this.data.name = value
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
