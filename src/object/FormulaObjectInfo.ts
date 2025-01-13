import { FormulaInfo, parseExpression } from '../utils/expression'
import { ObjectInfo, ObjectPath } from './ObjectInfo'
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import ReferableVariableStorage from '../variable/ReferableVariableStorage'
import { ReferrableVariable } from '../variable'
import ReferableVariableManager from '../variable/ReferableVariableManager'
import VariableConnector from '../variable/VariableConnector'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

export const formulaObjectConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.number(),
})

export type FormulaObjectConfig = z.infer<typeof formulaObjectConfigSchema>

export type FormulaObjectEventPacket = EventPacket<
  'FORMULA_VALUE_UPDATE',
  { value: number }
>

export class FormulaObjectInfo extends ObjectInfo {
  readonly config: FormulaObjectConfig
  readonly data: Record<string, number> = {}
  private formulaInfo: FormulaInfo
  private referableVariableManager: ReferableVariableManager
  readonly eventDispatcher: EventDispatcher<FormulaObjectEventPacket> =
    new EventDispatcher()
  value: number = 0
  notFoundVariables: string[] = []

  constructor(
    referableVariableManager: ReferableVariableManager,
    formulaInfo: FormulaInfo,
    id?: string
  ) {
    super()
    this.config = {
      type: 'FORMULA',
      id: id ?? uuidv4(),
      formula: '',
      value: 0,
    }
    this.referableVariableManager = referableVariableManager
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
      this.referableVariableManager.variableConnectorStorage.delete(
        this.config.id,
        [variable]
      )
    }

    // update formula
    this.formulaInfo = formulaInfo
    this.notFoundVariables = []

    let variables: ReferrableVariable[] = []
    for (const variable of formulaInfo.variables) {
      const variableInfo =
        this.referableVariableManager.variableStorage.getVariableByRef(variable)
      if (variableInfo !== null) {
        variables.push(variableInfo)
      } else {
        this.notFoundVariables.push(variable)
      }
    }

    for (const variable of variables) {
      // set up initial data
      this.data[variable.ref] = variable.value

      // set up connector
      const connector = new VariableConnector(variable, this, [variable.ref])
      this.referableVariableManager.variableConnectorStorage.set(connector)
    }

    // calculate initial value
    this.calculateValue()
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

  destroy() {
    // clear connector
    for (const variable of this.formulaInfo.variables) {
      this.referableVariableManager.variableConnectorStorage.delete(
        this.config.id,
        [variable]
      )
    }
  }
}
