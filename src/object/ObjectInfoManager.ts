import { ObjectInfoStorage } from './ObjectInfoStorage'

export class ObjectInfoManager {
  readonly objectInfoStorage: ObjectInfoStorage
  constructor() {
    this.objectInfoStorage = new ObjectInfoStorage()
  }
}
