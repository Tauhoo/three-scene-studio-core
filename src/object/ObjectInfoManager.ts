import EventDispatcher from '../utils/EventDispatcher'
import { ObjectInfo } from './ObjectInfo'
import { ObjectInfoStorage } from './ObjectInfoStorage'

type ObjectInfoManagerEvent = {
  type: 'OBJECT_INFO_ADDED'
  data: ObjectInfo
}

export class ObjectInfoManager extends EventDispatcher<ObjectInfoManagerEvent> {
  readonly objectInfoStorage: ObjectInfoStorage
  constructor() {
    super()
    this.objectInfoStorage = new ObjectInfoStorage()
  }
}
