import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { Variable, VariableEventPacket } from './Variable'

export type ReferrableVariableEventPacket =
  | {
      type: 'NAME_CHANGED'
      data: string
    }
  | {
      type: 'REF_CHANGED'
      data: string
    }

export abstract class ReferrableVariable<
  T extends string,
  D extends
    | EventPacket<string, any>
    | ReferrableVariableEventPacket
    | VariableEventPacket = ReferrableVariableEventPacket | VariableEventPacket
> extends Variable<T, D> {
  private _name: string
  private _ref: string

  constructor(type: T, id: string, name: string, value: number, ref: string) {
    super(type, id, value)
    this._name = name
    this._ref = ref
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    this._name = name
    this.dispatcher.dispatch('NAME_CHANGED', name)
  }

  get ref() {
    return this._ref
  }

  set ref(ref: string) {
    this._ref = ref
    this.dispatcher.dispatch('REF_CHANGED', ref)
  }

  abstract serialize(): {
    type: string
    id: string
    name: string
    value: number
    ref: string
  }
}
