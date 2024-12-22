import { ObjectInfo, ObjectReference } from './ObjectInfo'

export type InSceneIdentifier = {
  sceneId: number
  id: number
}

export type ObjectInSceneInfoReference = ObjectReference & InSceneIdentifier

export abstract class ObjectInSceneInfo<
  T extends ObjectInSceneInfoReference = ObjectInSceneInfoReference,
  D extends any = any
> extends ObjectInfo<T, D> {
  children: ObjectInSceneInfo[]

  constructor(reference: T, data: D, sceneId: number) {
    super(reference, data)
    this.children = this.getChildren(data, sceneId)
  }

  protected abstract getChildren(data: D, sceneId: number): ObjectInSceneInfo[]

  findChildrenByNativeId(id: number): ObjectInSceneInfo | null {
    if (this.reference.id === id) {
      return this
    }

    for (const child of this.children) {
      const result = child.findChildrenByNativeId(id)
      if (result !== null) {
        return result
      }
    }

    return null
  }

  serialize(): ObjectReference {
    return this.reference
  }
}
