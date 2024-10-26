import DataStorage from './DataStorage'
import CameraObjectInfo, {
  CameraObjectReference,
} from '../object/CameraObjectInfo'

class CameraObjectInfoStorage extends DataStorage<
  CameraObjectReference,
  CameraObjectInfo
> {
  constructor() {
    super(reference => reference.id.toString())
  }
}

export default CameraObjectInfoStorage
