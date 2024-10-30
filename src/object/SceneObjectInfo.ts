import * as THREE from 'three'
import ObjectInfo from './ObjectInfo'
import DataStorage from '../utils/DataStorage'

export interface SceneObjectReference {
  type: 'OBJECT_3D_SCENE'
  id: number
}

class SceneObjectInfo extends ObjectInfo<
  SceneObjectReference,
  THREE.Group<THREE.Object3DEventMap>
> {
  constructor(data: THREE.Group<THREE.Object3DEventMap>) {
    super(
      {
        type: 'OBJECT_3D_SCENE',
        id: data.id,
      },
      data
    )
  }
}

export default SceneObjectInfo

export class SceneObjectInfoStorage extends DataStorage<
  SceneObjectReference,
  SceneObjectInfo
> {
  constructor(scenes: THREE.Group<THREE.Object3DEventMap>[]) {
    super(reference => reference.id.toString())
    scenes.forEach(scene => {
      const sceneObjectInfo = new SceneObjectInfo(scene)
      this.set(sceneObjectInfo.reference, sceneObjectInfo)
    })
  }
}
