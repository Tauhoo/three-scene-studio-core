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
    let isUpdate = key in this.dataMap
    this.dataMap[key] = value
    if (isUpdate) {
      this.dispatch('UPDATE', value)
    } else {
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
  }

  getAll() {
    return Object.values(this.dataMap)
  }
}

export default DataStorage
