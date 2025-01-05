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

  constructor(values: T[]) {
    super()
    this.values = values
  }

  remove(value: T) {
    this.values = this.values.filter(v => v !== value)
  }

  add(value: T) {
    this.values.push(value)
  }

  get current() {
    if (this._index < 0 || this._index >= this.values.length) return null
    return this.values[this._index]
  }

  get index() {
    return this._index
  }

  set index(index: number) {
    this.dispatch('INDEX_CHANGE', { from: this._index, to: index })
    this._index = index
  }
}

export default Switcher
