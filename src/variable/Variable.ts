import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { v4 as uuidv4 } from 'uuid'

export type VariableEventPacket = {
  type: 'VALUE_CHANGED'
  data: number
}

export abstract class Variable<
  T extends string = string,
  D extends EventPacket<string & {}, any> | VariableEventPacket =
    | EventPacket<string & {}, any>
    | VariableEventPacket
> {
  readonly type: T
  readonly id: string
  private _value: number
  readonly dispatcher: EventDispatcher<D>

  constructor(type: T, value: number, id?: string) {
    this.type = type
    this.id = id ?? uuidv4()
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

function name(
  params: EventPacket<string, any> | EventPacket<'VALUE_CHANGED', number>
) {
  if (params.type === '') {
    return params.data
  }
}
