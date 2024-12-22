import { getChildren, Parent } from './children'
import { ObjectInfo, ObjectReference } from './ObjectInfo'

export abstract class ObjectInSceneInfo<
  T extends ObjectReference = ObjectReference,
  D extends Parent = Parent
> extends ObjectInfo<T, D> {
  children: ObjectInSceneInfo[]

  constructor(reference: T, data: D, sceneId: number) {
    super(reference, data)
    this.children = getChildren(data, sceneId)
  }

  serialize(): ObjectReference {
    return this.reference
  }
}
