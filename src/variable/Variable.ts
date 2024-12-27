import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { v4 as uuidv4 } from 'uuid'
import { VariableGroup } from './types'

export type VariableEventPacket = {
  type: 'VALUE_CHANGED'
  data: number
}

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
