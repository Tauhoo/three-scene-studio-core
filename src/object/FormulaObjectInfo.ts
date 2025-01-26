import { FormulaInfo } from '../utils/expression'
import { ObjectInfo, ObjectInfoEvent, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { ReferrableVariable } from '../variable'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import VariableManager from '../variable/VariableManager'

export const formulaObjectConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.number(),
})

export type FormulaObjectConfig = z.infer<typeof formulaObjectConfigSchema>

export type FormulaObjectEventPacket =
  | EventPacket<'FORMULA_VALUE_UPDATE', { value: any }>
  | ObjectInfoEvent

export class FormulaObjectInfo extends ObjectInfo {
  readonly config: FormulaObjectConfig
  readonly data: Record<string, number> = {}
  private formulaInfo: FormulaInfo
  private variableManager: VariableManager
  readonly eventDispatcher: EventDispatcher<FormulaObjectEventPacket>
  value: number = 0
  notFoundVariables: string[] = []

  constructor(
    variableManager: VariableManager,
    formulaInfo: FormulaInfo,
    id?: string
  ) {
    super()
    this.eventDispatcher = new EventDispatcher()
    this.config = {
      type: 'FORMULA',
      id: id ?? uuidv4(),
      formula: '',
      value: 0,
    }
    this.variableManager = variableManager
    this.formulaInfo = formulaInfo
    this.updateFormula(formulaInfo)
  }

  updateFormula(formulaInfo: FormulaInfo) {
    // clear data
    for (const [key, value] of Object.entries(this.data)) {
      delete this.data[key]
    }
    // clear connector
    for (const variable of this.formulaInfo.variables) {
      this.variableManager.variableConnectorStorage.delete(this.config.id, [
        variable,
      ])
    }

    // update formula
    this.formulaInfo = formulaInfo
    this.notFoundVariables = []

    let variables: ReferrableVariable[] = []
    for (const variable of formulaInfo.variables) {
      const variableInfo =
        this.variableManager.variableStorage.getVariableByRef(variable)
      if (variableInfo !== null) {
        variables.push(variableInfo)
      } else {
        this.notFoundVariables.push(variable)
      }
    }

    for (const variable of variables) {
      // set up initial data
      this.data[variable.ref] = variable.value
    }

    for (const variable of variables) {
      // set up connector
      this.variableManager.variableConnectorStorage.connectVariableToObjectInfo(
        variable,
        this,
        [variable.ref]
      )
    }
  }

  getFormulaInfo() {
    return this.formulaInfo
  }

  calculateValue() {
    const defaultNotFoundValue = Object.fromEntries(
      this.notFoundVariables.map(value => [value, 0])
    )
    const newValue = this.formulaInfo.node.evaluate({
      ...this.data,
      ...defaultNotFoundValue,
    })
    this.value = newValue
    this.eventDispatcher.dispatch('FORMULA_VALUE_UPDATE', { value: newValue })
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    this.calculateValue()
    return result
  }
}
