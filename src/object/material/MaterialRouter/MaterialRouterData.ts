import Switcher from '../../../utils/Switcher'
import { ObjectInfo } from '../../ObjectInfo'
import { ObjectInfoStorage } from '../../ObjectInfoStorage'
import { MaterialObjectInfo } from '../MaterialObjectInfo'

export class MaterialRouterData {
  name: string
  switcher: Switcher<MaterialObjectInfo>
  objectInfoStorage: ObjectInfoStorage

  constructor(
    name: string,
    data: MaterialObjectInfo[],
    objectInfoStorage: ObjectInfoStorage
  ) {
    this.name = name
    this.switcher = new Switcher('Material', data)
    this.objectInfoStorage = objectInfoStorage
    this.registerEvent(...data)
  }

  private onMaterialDestroyed = (objectInfo: ObjectInfo) => {
    const defaultStandardMaterialObjectInfo =
      this.objectInfoStorage.getDefaultStandardMaterialObjectInfo()
    for (let i = 0; i < this.switcher.values.length; i++) {
      const item = this.switcher.values[i]
      if (item === objectInfo) {
        this.switcher.set(defaultStandardMaterialObjectInfo, i)
      }
    }
  }

  private registerEvent(...data: MaterialObjectInfo[]) {
    for (const material of data) {
      material.eventDispatcher.addListener('DESTROY', this.onMaterialDestroyed)
    }
  }

  destroy() {
    for (const material of this.switcher.values) {
      material.eventDispatcher.removeListener(
        'DESTROY',
        this.onMaterialDestroyed
      )
    }
  }
}

export default MaterialRouterData
