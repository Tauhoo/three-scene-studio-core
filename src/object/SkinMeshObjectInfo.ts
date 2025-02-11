import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'
import { ObjectInfo, ObjectPath } from './ObjectInfo'
import { BoneObjectInfo } from './BoneObjectInfo'

export const skinMeshObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_SKIN_MESH'),
  id: z.string(),
  sceneId: z.number(),
  inSceneId: z.number(),
})

export type SkinMeshObjectConfig = z.infer<typeof skinMeshObjectConfigSchema>

export type SkinMeshObjectInfoEvent =
  | EventPacket<'BONES_UPDATED', SkinMeshObjectInfo>
  | InSceneObjectInfoEvent
export class SkinMeshObjectInfo extends InSceneObjectInfo {
  readonly config: SkinMeshObjectConfig
  readonly data: THREE.SkinnedMesh
  readonly eventDispatcher: EventDispatcher<SkinMeshObjectInfoEvent>

  constructor(
    data: THREE.SkinnedMesh,
    sceneId: number,
    objectInfoStorage: ObjectInfoStorage,
    id?: string
  ) {
    super(data, sceneId, objectInfoStorage)
    this.config = {
      type: 'OBJECT_3D_SKIN_MESH',
      id: id ?? uuidv4(),
      sceneId,
      inSceneId: data.id,
    }
    this.data = data
    this.eventDispatcher = new EventDispatcher()
    this.objectInfoStorage.addListener('DELETE', this.onDelete)
  }

  onDelete = (objectInfo: ObjectInfo) => {
    if (!(objectInfo instanceof InSceneObjectInfo)) return
    const boneObjectSet: Set<THREE.Bone> = new Set()
    objectInfo.traverseChildren(child => {
      if (child instanceof BoneObjectInfo) {
        boneObjectSet.add(child.data)
      }
    })
    const startAmount = this.data.skeleton.bones.length
    this.data.skeleton.bones = this.data.skeleton.bones.filter(
      bone => !boneObjectSet.has(bone)
    )
    const endAmount = this.data.skeleton.bones.length
    if (startAmount !== endAmount) {
      this.data.skeleton.calculateInverses()
      this.eventDispatcher.dispatch('BONES_UPDATED', this)
    }
  }

  getBoneObjectInfos(): BoneObjectInfo[] {
    const boneObjectInfos: BoneObjectInfo[] = []
    const bones = new Set(this.data.skeleton.bones)
    for (const objectInfo of this.objectInfoStorage.getAll()) {
      if (objectInfo instanceof BoneObjectInfo) {
        if (bones.has(objectInfo.data)) {
          boneObjectInfos.push(objectInfo)
        }
      }
    }
    return boneObjectInfos
  }

  setValue(objectPath: ObjectPath, value: any) {
    const result = super.setValue(objectPath, value)
    return result
  }

  destroy(): void {
    this.objectInfoStorage.removeListener('DELETE', this.onDelete)
    super.destroy()
  }
}
