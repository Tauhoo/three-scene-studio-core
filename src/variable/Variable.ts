import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { v4 as uuidv4 } from 'uuid'
import { VariableGroup } from './types'
import { NodeValueType } from '../utils'

export type VariableEventPacket =
  | EventPacket<'DESTROY', null>
  | EventPacket<'VALUE_TYPE_CHANGED', NodeValueType>

export abstract class Variable {
  abstract type: string
  abstract group: VariableGroup
  abstract dispatcher: EventDispatcher<
    EventPacket<string & {}, any> | VariableEventPacket
  >
  readonly id: string
  abstract readonly value: NumberValue | VectorValue

  constructor(id?: string) {
    this.id = id ?? uuidv4()
  }

  destroy() {
    this.dispatcher.dispatch('DESTROY', null)
  }

  abstract serialize(): {
    type: string
    id: string
    value: number | number[]
  }
}
export class NumberValue extends EventDispatcher<
  EventPacket<'VALUE_CHANGED', number>
> {
  readonly valueType: 'NUMBER' = 'NUMBER'
  constructor(private _value: number) {
    super()
  }

  set(value: number) {
    if (this._value === value) return
    this._value = value
    this.dispatch('VALUE_CHANGED', value)
  }

  get(): number {
    return this._value
  }
}

export class VectorValue extends EventDispatcher<
  EventPacket<'VALUE_CHANGED', number[]>
> {
  readonly valueType: 'VECTOR' = 'VECTOR'
  constructor(private _value: number[]) {
    super()
  }

  get(): number[] {
    return this._value
  }

  set(value: number[]) {
    if (this._value === value) return
    this._value = value
    this.dispatch('VALUE_CHANGED', value)
  }
}
