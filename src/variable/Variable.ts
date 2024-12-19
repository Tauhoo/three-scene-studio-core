import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

export type VariableEventPacket = {
  type: 'VALUE_CHANGED'
  data: number
}

export abstract class Variable<
  T extends string,
  D extends EventPacket<string, any> | VariableEventPacket = VariableEventPacket
> {
  readonly type: T
  readonly id: string
  private _value: number
  readonly dispatcher: EventDispatcher<D>

  constructor(type: T, id: string, value: number) {
    this.type = type
    this.id = id
    this._value = value
    this.dispatcher = new EventDispatcher<D>()
  }

  get value() {
    return this._value
  }

  set value(value: number) {
    this._value = value
    this.dispatcher.dispatch('VALUE_CHANGED', value)
  }

  abstract serialize(): {
    type: string
    id: string
    value: number
  }
}
