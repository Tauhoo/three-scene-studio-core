import EventDispatcher from './EventDispatcher'

type EventPackage = {
  type: 'INDEX_CHANGE'
  data: {
    from: number
    to: number
  }
}

class Switcher<T> extends EventDispatcher<EventPackage> {
  values: T[]
  private _index = 0
  name: string

  constructor(name: string, values: T[]) {
    super()
    this.values = values
    this.name = name
  }

  remove(value: T) {
    this.values = this.values.filter(v => v !== value)
  }

  add(value: T) {
    this.values.push(value)
  }

  get current() {
    if (this._index < 0 || this._index >= this.values.length) return null
    if (this._index % 1 !== 0) return null
    return this.values[this._index]
  }

  get index() {
    return this._index
  }

  set index(index: number) {
    let value = index
    if (index < 0 || index >= this.values.length) {
      value = 0
    }
    if (index % 1 !== 0) {
      value = 0
    }
    const from = this._index
    if (from === value) return
    this._index = value
    this.dispatch('INDEX_CHANGE', { from, to: value })
  }
}

export default Switcher
