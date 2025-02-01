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
      data: { from: V; to: V }
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
    const from = this.dataMap[key]
    if (from !== undefined) {
      this.dataMap[key] = value
      this.dispatch('UPDATE', { from, to: value })
    } else {
      this.dataMap[key] = value
      this.dispatch('ADD', value)
    }
  }

  get(reference: K) {
    const key = this.keyConverter(reference)
    return this.dataMap[key] ?? null
  }

  delete(reference: K) {
    const key = this.keyConverter(reference)
    const value = this.dataMap[key]
    if (key in this.dataMap) {
      delete this.dataMap[key]
      this.dispatch('DELETE', value)
    }
    return value ?? null
  }

  getAll() {
    return Object.values(this.dataMap)
  }
}

export default DataStorage
