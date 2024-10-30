import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

export interface LightObjectReference {
  type: 'OBJECT_3D_LIGHT'
  sceneId: number
  uuid: string
}

class LightObjectInfo extends ObjectInfo<LightObjectReference, THREE.Light> {
  constructor(data: THREE.Light, sceneId: number) {
    super(
      {
        type: 'OBJECT_3D_LIGHT',
        sceneId,
        uuid: data.uuid,
      },
      data
    )
  }
}

export default LightObjectInfo

export class LightObjectInfoStorage extends DataStorage<
  LightObjectReference,
  LightObjectInfo
> {
  constructor(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    super(reference => reference.uuid)
    scenes.forEach(scene => {
      scene.traverse(child => {
        if (child instanceof THREE.Light) {
          const lightObjectInfo = new LightObjectInfo(child, scene.id)
          this.set(lightObjectInfo.reference, lightObjectInfo)
        }
      })
    })
  }
}
