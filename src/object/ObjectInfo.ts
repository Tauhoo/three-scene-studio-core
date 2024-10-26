interface ObjectReference {
  type: string
}

abstract class ObjectInfo<
  T extends ObjectReference = ObjectReference,
  D = any
> {
  readonly reference: T
  readonly data: D
  constructor(reference: T, data: D) {
    this.reference = reference
    this.data = data
  }

  serialize(): string {
    return JSON.stringify(this.reference)
  }
}

export default ObjectInfo
