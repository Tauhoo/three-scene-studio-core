import { GLTF } from '../loader'
import { CameraObjectInfo, ObjectInfo, SceneObjectInfo } from './index'
import * as THREE from 'three'
import LightObjectInfo from './LightObjectInfo'
import CameraObjectInfoStorage from '../dataStorage/CameraObjectInfoStorage'

class ObjectInfoManager {
  private gltf: GLTF
  private addedCameraObjectInfoStorage = new CameraObjectInfoStorage()

  constructor(gltf: GLTF) {
    this.gltf = gltf
  }

  getAllSceneObjectInfos() {
    return this.gltf.scenes.map(scene => new SceneObjectInfo(scene))
  }

  getAllCameraObjectInfos() {
    const gltfCameras = this.gltf.cameras.map(
      camera => new CameraObjectInfo(camera)
    )
    const addedCameras = this.addedCameraObjectInfoStorage.getAll()
    return {
      gltfCameras,
      addedCameras,
    }
  }

  addCamera(camera: THREE.Camera) {
    const objectInfo = new CameraObjectInfo(camera)
    this.addedCameraObjectInfoStorage.set(objectInfo.reference, objectInfo)
    return objectInfo
  }

  getAllLightObjectInfos() {
    const lights: LightObjectInfo[] = []
    this.gltf.scene.traverse((object: any) => {
      if (object.isLight) {
        lights.push(new LightObjectInfo(object as THREE.Light))
      }
    })
    return lights
  }
}

export default ObjectInfoManager
