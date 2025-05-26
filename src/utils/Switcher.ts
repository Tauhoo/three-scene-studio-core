import EventDispatcher from './EventDispatcher'

type EventPackage =
  | {
      type: 'INDEX_CHANGE'
      data: {
        from: number
        to: number
      }
    }
  | {
      type: 'SET'
      data: {
        index: number
      }
    }
  | {
      type: 'ADD'
      data: {
        index: number
      }
    }
  | {
      type: 'REMOVE'
      data: {
        indexes: number[]
      }
    }
  | {
      type: 'CURRENT_CHANGE'
      data: {
        index: number
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

  removeWithIndex(index: number) {
    this.values.splice(index, 1)
    this.dispatch('REMOVE', { indexes: [index] })
    if (this._index === index) {
      this.dispatch('CURRENT_CHANGE', { index: this._index })
    }
  }

  remove(value: T) {
    let indexes: number[] = []
    let needUpdate = false
    this.values = this.values.filter((v, i) => {
      if (i <= this._index) {
        needUpdate = true
      }
      if (v !== value) {
        indexes.push(i)
        return true
      } else {
        return false
      }
    })
    this.dispatch('REMOVE', { indexes: indexes })
    if (needUpdate) {
      this.dispatch('CURRENT_CHANGE', { index: this._index })
    }
  }

  add(value: T) {
    this.values.push(value)
    this.dispatch('ADD', { index: this.values.length - 1 })
  }

  set(value: T, index: number) {
    this.values[index] = value
    this.dispatch('SET', { index })
    if (index === this._index) {
      this.dispatch('CURRENT_CHANGE', { index: this._index })
    }
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
    this.dispatch('CURRENT_CHANGE', { index: this._index })
  }
}

export default Switcher
