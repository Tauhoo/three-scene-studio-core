import SceneObjectInfo from './SceneObjectInfo'
import CameraObjectInfo, { getDefaultCamera } from './CameraObjectInfo'
import AnimationObjectInfo from './AnimationObjectInfo'
import MeshObjectInfo from './MeshObjectInfo'

export {
  SceneObjectInfo,
  CameraObjectInfo,
  AnimationObjectInfo,
  MeshObjectInfo,
  getDefaultCamera,
}

export type ObjectInfo =
  | SceneObjectInfo
  | CameraObjectInfo
  | AnimationObjectInfo
  | MeshObjectInfo
export type ObjectType = ObjectInfo['reference']['type']
export type ObjectReference = ObjectInfo['reference']
