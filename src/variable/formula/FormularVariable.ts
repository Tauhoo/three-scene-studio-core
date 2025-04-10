import * as z from 'zod'
import { Variable } from '../Variable'
import EventDispatcher from '../../utils/EventDispatcher'
import { ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'
import {
  FormulaManager,
  FormulaManagerEventPacket,
  FormulaManagerState,
} from './FormulaManager'
import { NodeValueType } from '../../utils'

export const formulaVariableConfigSchema = z.object({
  type: z.literal('FORMULA'),
  id: z.string(),
  value: z.union([z.number(), z.array(z.number())]),
  formula: z.string(),
})

export type FormulaVariableConfig = z.infer<typeof formulaVariableConfigSchema>

export type FormulaVariableEventPacket = FormulaManagerEventPacket
export class FormulaVariable extends Variable {
  type: 'FORMULA' = 'FORMULA'
  group: 'PRIVATE' = 'PRIVATE'
  dispatcher = new EventDispatcher<FormulaVariableEventPacket>()
  formulaManager: FormulaManager

  constructor(
    formula: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    super(id)
    this.formulaManager = new FormulaManager(
      formula,
      objectInfoManager,
      variableConnectorStorage,
      variableStorage,
      id
    )
    this.formulaManager.dispatcher.addListener(
      'VALUE_TYPE_CHANGED',
      this.onValueTypeChange
    )
    this.formulaManager.dispatcher.addListener(
      'RECURSIVE_FORMULA_DETECTED',
      this.onRecursiveFormulaDetected
    )
    this.formulaManager.dispatcher.addListener(
      'STATE_CHANGED',
      this.onStateChange
    )
  }

  onStateChange = (state: FormulaManagerState) => {
    this.dispatcher.dispatch('STATE_CHANGED', state)
  }

  onValueTypeChange = (valueType: NodeValueType) => {
    this.dispatcher.dispatch('VALUE_TYPE_CHANGED', valueType)
  }

  onRecursiveFormulaDetected = (detectedPath: string[]) => {
    this.dispatcher.dispatch('RECURSIVE_FORMULA_DETECTED', detectedPath)
  }

  get value() {
    return this.formulaManager.value
  }

  destroy() {
    this.formulaManager.dispatcher.removeListener(
      'VALUE_TYPE_CHANGED',
      this.onValueTypeChange
    )
    this.formulaManager.dispatcher.removeListener(
      'STATE_CHANGED',
      this.onStateChange
    )
    this.formulaManager.dispatcher.removeListener(
      'RECURSIVE_FORMULA_DETECTED',
      this.onRecursiveFormulaDetected
    )
    this.formulaManager.destroy()
    super.destroy()
  }

  serialize(): FormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formula: this.formulaManager.formula,
      value: this.formulaManager.value.get(),
    }
  }
}
