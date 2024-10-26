class DataStorage<K, V> {
  private dataMap: Record<string, V> = {}
  private keyConverter: (reference: K) => string
  constructor(keyConverter: (reference: K) => string) {
    this.keyConverter = keyConverter
  }

  set(reference: K, value: V) {
    const key = this.keyConverter(reference)
    this.dataMap[key] = value
  }

  get(reference: K) {
    const key = this.keyConverter(reference)
    return this.dataMap[key]
  }

  getAll() {
    return Object.values(this.dataMap)
  }
}

export default DataStorage
