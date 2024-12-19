export interface ObjectReference {
  type: string
}

export abstract class ObjectInfo<
  T extends ObjectReference = ObjectReference,
  D = any
> {
  readonly reference: T
  readonly data: D
  constructor(reference: T, data: D) {
    this.reference = reference
    this.data = data
  }

  serialize(): ObjectReference {
    return this.reference
  }
}
