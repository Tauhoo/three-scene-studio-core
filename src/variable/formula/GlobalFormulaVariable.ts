import * as z from 'zod'
import EventDispatcher from '../../utils/EventDispatcher'
import {
  ReferrableVariable,
  ReferrableVariableEventPacket,
} from '../ReferrableVariable'
import { ObjectInfoManager } from '../../object'
import { VariableConnectorStorage } from '../VariableConnectorStorage'
import { VariableStorage } from '../VariableStorage'
import { NodeValueType } from '../../utils'
import {
  FormulaManager,
  FormulaManagerEventPacket,
  FormulaManagerState,
} from './FormulaManager'

export const globalFormulaVariableConfigSchema = z.object({
  type: z.literal('GLOBAL_FORMULA'),
  id: z.string(),
  formula: z.string(),
  value: z.union([z.number(), z.array(z.number())]),
  name: z.string(),
  ref: z.string(),
})

export type GlobalFormulaVariableConfig = z.infer<
  typeof globalFormulaVariableConfigSchema
>

export type GlobalFormulaVariableEventPacket =
  | ReferrableVariableEventPacket
  | FormulaManagerEventPacket

export class GlobalFormulaVariable extends ReferrableVariable {
  type: 'GLOBAL_FORMULA' = 'GLOBAL_FORMULA'
  group: 'USER_DEFINED' = 'USER_DEFINED'
  dispatcher = new EventDispatcher<GlobalFormulaVariableEventPacket>()
  formulaManager: FormulaManager

  constructor(
    ref: string,
    name: string,
    formula: string,
    objectInfoManager: ObjectInfoManager,
    variableConnectorStorage: VariableConnectorStorage,
    variableStorage: VariableStorage,
    id?: string
  ) {
    super(name, ref, id)
    this.formulaManager = new FormulaManager(
      formula,
      objectInfoManager,
      variableConnectorStorage,
      variableStorage,
      ref
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
    this.formulaManager.dispatcher.addListener(
      'RECURSIVE_STATE_UPDATED',
      this.onRecursiveStateUpdated
    )
  }

  onRecursiveStateUpdated = () => {
    this.dispatcher.dispatch(
      'RECURSIVE_STATE_UPDATED',
      this.formulaManager.getState()
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

  serialize(): GlobalFormulaVariableConfig {
    return {
      type: this.type,
      id: this.id,
      formula: this.formulaManager.formula,
      value: this.formulaManager.value.get(),
      name: this.name,
      ref: this.ref,
    }
  }
}
