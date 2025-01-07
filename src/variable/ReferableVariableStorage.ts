import DataStorage from '../utils/DataStorage'
import { VariableGroup } from '.'
import { ReferrableVariable } from './ReferrableVariable'
import VariableStorage from './VariableStorage'

class ReferableVariableStorage extends VariableStorage {
  private refStorage: DataStorage<string, ReferrableVariable>

  constructor() {
    super()
    this.refStorage = new DataStorage<string, ReferrableVariable>(ref => ref)
  }

  deleteVariableById(id: string) {
    const variable = this.getVariableById(id)
    if (variable === null) return
    this.idStorage.delete(id)
    if (variable instanceof ReferrableVariable) {
      this.refStorage.delete(variable.ref)
    }
    this.dispatch('DELETE_VARIABLE', {
      variable,
    })
  }

  searchVariable(search: string, group: VariableGroup | null = null) {
    return this.refStorage.getAll().filter(variable => {
      if (variable.group === group || group === null) {
        if (variable.ref.includes(search)) {
          return true
        }
        if (variable.name.includes(search)) {
          return true
        }
        return false
      } else {
        return false
      }
    })
  }

  getVariableByRef(ref: string) {
    return this.refStorage.get(ref)
  }

  getVariableById(id: string) {
    const variable = this.idStorage.get(id)
    if (variable instanceof ReferrableVariable) {
      return variable
    }
    return null
  }

  getAllVariables() {
    const result: ReferrableVariable[] = []
    this.idStorage.getAll().forEach(variable => {
      if (variable instanceof ReferrableVariable) {
        result.push(variable)
      }
    })
    return result
  }

  setVariable(variable: ReferrableVariable) {
    this.refStorage.set(variable.ref, variable)
    super.setVariable(variable)
  }
}

export default ReferableVariableStorage
