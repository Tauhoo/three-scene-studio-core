import ObjectInfo from '../object/ObjectInfo'
import Variable from './Variable'

type ObjectPath = [number, ...string[]]

class VariableConnector {
  private variable: Variable
  private object: ObjectInfo
  private updateObject: (value: number) => void

  constructor(variable: Variable, object: ObjectInfo, objectPath: ObjectPath) {
    this.variable = variable
    this.object = object

    this.updateObject = (value: number) => {
      let data = this.object.data
      for (let index = 0; index < objectPath.length - 1; index++) {
        const key = objectPath[index]
        data = data[key]
      }
      data[objectPath[objectPath.length - 1]] = value
    }
    this.variable.dispatcher.addListener('VALUE_CHANGED', this.updateObject)
  }

  destroy() {
    this.variable.dispatcher.removeListener('VALUE_CHANGED', this.updateObject)
  }
}

export default VariableConnector
