import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { v4 as uuidv4 } from 'uuid'
import { VariableGroup } from './types'

export type VariableEventPacket =
  | EventPacket<'VALUE_CHANGED', number>
  | EventPacket<'DESTROY', null>

export abstract class Variable {
  abstract type: string
  abstract group: VariableGroup
  abstract dispatcher: EventDispatcher<
    EventPacket<string & {}, any> | VariableEventPacket
  >
  readonly id: string
  private _value: number

  constructor(value: number, id?: string) {
    this.id = id ?? uuidv4()
    this._value = value
  }

  get value() {
    return this._value
  }

  set value(value: number) {
    this._value = value
    this.dispatcher.dispatch('VALUE_CHANGED', value)
  }

  destroy() {
    this.dispatcher.dispatch('DESTROY', null)
  }

  abstract serialize(): {
    type: string
    id: string
    value: number
  }
}
