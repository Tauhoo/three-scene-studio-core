import EventDispatcher from './EventDispatcher'

type EventType<V> =
  | {
      type: 'ADD'
      data: V
    }
  | {
      type: 'DELETE'
      data: V
    }
  | {
      type: 'UPDATE'
      data: V
    }

class DataStorage<K, V> extends EventDispatcher<EventType<V>> {
  private dataMap: Record<string, V> = {}
  private keyConverter: (reference: K) => string

  constructor(keyConverter: (reference: K) => string) {
    super()
    this.keyConverter = keyConverter
  }

  has(reference: K) {
    const key = this.keyConverter(reference)
    return key in this.dataMap
  }

  setMultiple(entries: [K, V][]) {
    entries.forEach(([reference, value]) => {
      this.set(reference, value)
    })
  }

  set(reference: K, value: V) {
    const key = this.keyConverter(reference)
    if (key in this.dataMap) {
      this.dispatch('UPDATE', value)
    } else {
      this.dispatch('ADD', value)
    }
    this.dataMap[key] = value
  }

  get(reference: K) {
    const key = this.keyConverter(reference)
    return this.dataMap[key] ?? null
  }

  delete(reference: K) {
    const key = this.keyConverter(reference)
    if (key in this.dataMap) {
      this.dispatch('DELETE', this.dataMap[key])
      delete this.dataMap[key]
    }
  }

  getAll() {
    return Object.values(this.dataMap)
  }
}

export default DataStorage
