import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

type VariableEventPacket =
  | {
      type: 'VALUE_CHANGED'
      data: number
    }
  | {
      type: 'NAME_CHANGED'
      data: string
    }
  | {
      type: 'REF_CHANGED'
      data: string
    }

class Variable<
  T extends string = string,
  D extends EventDispatcher<VariableEventPacket> = EventDispatcher<VariableEventPacket>
> {
  readonly type: T
  readonly id: string
  private _name: string
  private _value: number
  private _ref: string
  readonly dispatcher: D

  constructor(
    type: T,
    id: string,
    name: string,
    value: number,
    ref: string,
    dispatcher: D
  ) {
    this.type = type
    this.id = id
    this._name = name
    this._value = value
    this._ref = ref
    this.dispatcher = dispatcher
  }

  get value() {
    return this._value
  }

  set value(value: number) {
    this._value = value
    this.dispatcher.dispatch('VALUE_CHANGED', value)
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
}

export default Variable
