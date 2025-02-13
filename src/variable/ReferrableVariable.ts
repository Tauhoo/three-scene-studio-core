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

export abstract class ReferrableVariable extends Variable {
  private _name: string
  private _ref: string

  abstract dispatcher: EventDispatcher<
    | EventPacket<string & {}, any>
    | ReferrableVariableEventPacket
    | VariableEventPacket
  >

  constructor(name: string, value: number, ref: string, id?: string) {
    super(value, id)
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
