class Switcher<T> {
  values: T[]
  index = 0

  constructor(values: T[]) {
    this.values = values
  }

  get current() {
    if (this.index < 0 || this.index >= this.values.length) return null
    return this.values[this.index]
  }
}

export default Switcher
