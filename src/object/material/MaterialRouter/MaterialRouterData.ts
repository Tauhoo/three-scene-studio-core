import Switcher from '../../../utils/Switcher'
import { MaterialObjectInfo } from '../MaterialObjectInfo'

export class MaterialRouterData {
  name: string
  switcher: Switcher<MaterialObjectInfo>
  constructor(name: string, data: MaterialObjectInfo[]) {
    this.name = name
    this.switcher = new Switcher('Material', data)
  }
}

export default MaterialRouterData
