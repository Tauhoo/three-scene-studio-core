class DataStorage<K, V> {
  private dataMap: Record<string, V> = {}
  private keyConverter: (reference: K) => string
  constructor(keyConverter: (reference: K) => string) {
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
    this.dataMap[key] = value
  }

  get(reference: K) {
    const key = this.keyConverter(reference)
    return this.dataMap[key] ?? null
  }

  delete(reference: K) {
    const key = this.keyConverter(reference)
    delete this.dataMap[key]
  }

  getAll() {
    return Object.values(this.dataMap)
  }
}

export default DataStorage
