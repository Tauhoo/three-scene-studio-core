import SceneObjectInfo from './SceneObjectInfo'
import CameraObjectInfo, { getDefaultCamera } from './CameraObjectInfo'
import AnimationObjectInfo from './AnimationObjectInfo'
import MeshObjectInfo from './MeshObjectInfo'
import LightObjectInfo from './LightObjectInfo'

export {
  SceneObjectInfo,
  CameraObjectInfo,
  AnimationObjectInfo,
  MeshObjectInfo,
  getDefaultCamera,
}

export type ObjectInfos =
  | SceneObjectInfo
  | CameraObjectInfo
  | AnimationObjectInfo
  | LightObjectInfo
  | MeshObjectInfo
export type ObjectType = ObjectInfos['reference']['type']
export type ObjectReference = ObjectInfos['reference']
