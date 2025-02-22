import * as THREE from 'three'
import * as z from 'zod'
import { InSceneObjectInfo, InSceneObjectInfoEvent } from './InSceneObjectInfo'
import { v4 as uuidv4 } from 'uuid'
import { ObjectInfoStorage } from './ObjectInfoStorage'
import EventDispatcher, { EventPacket } from '../utils/EventDispatcher'

export const sceneObjectConfigSchema = z.object({
  type: z.literal('OBJECT_3D_SCENE'),
  id: z.string(),
  sceneId: z.string(),
  childrenIds: z.array(z.string()),
})

export type SceneObjectConfig = z.infer<typeof sceneObjectConfigSchema>

export type SceneObjectInfoEvent =
  | InSceneObjectInfoEvent
  | EventPacket<'HELPER_AXIS_CHANGED', boolean>
  | EventPacket<'HELPER_GRID_CHANGED', boolean>

export class SceneObjectInfo extends InSceneObjectInfo {
  readonly config: SceneObjectConfig
  readonly data: THREE.Scene
  readonly animationMixer: THREE.AnimationMixer
  readonly eventDispatcher: EventDispatcher<SceneObjectInfoEvent>
  private axisHelper: THREE.AxesHelper | null = null
  private gridHelper: THREE.GridHelper | null = null

  constructor(
    data: THREE.Scene,
    objectInfoStorage: ObjectInfoStorage,
    id?: string,
    children?: InSceneObjectInfo[]
  ) {
    const actualId = id ?? uuidv4()
    super(data, actualId, actualId, objectInfoStorage, children)
    this.config = {
      type: 'OBJECT_3D_SCENE',
      id: actualId,
      sceneId: actualId,
      childrenIds: this.children.map(child => child.config.id),
    }
    this.data = data
    this.animationMixer = new THREE.AnimationMixer(this.data)
    this.eventDispatcher = new EventDispatcher()
    this.eventDispatcher.addListener('NEW_OBJECT_ADDED', this.updateHelper)
    this.eventDispatcher.addListener('CHILD_DESTROY', this.updateHelper)
    this.eventDispatcher.addListener(
      'CHILD_MOVE_TO_NEW_SCENE',
      this.updateHelper
    )
  }

  updateHelper = () => {
    if (this.axisHelper !== null) {
      this.helperAxis(false)
      this.helperAxis(true)
    }
    if (this.gridHelper !== null) {
      this.helperGrid(false)
      this.helperGrid(true)
    }
  }

  helperAxis(value: boolean) {
    if (value && this.axisHelper === null) {
      const size = this.getSceneBoundingSize()
      const max = Math.max(
        Math.abs(size.x),
        Math.abs(size.y),
        Math.abs(size.z),
        100
      )
      const axisHelper = new THREE.AxesHelper(max * 2)
      this.data.add(axisHelper)
      this.axisHelper = axisHelper
      this.eventDispatcher.dispatch('HELPER_AXIS_CHANGED', true)
    }

    if (!value && this.axisHelper !== null) {
      this.data.remove(this.axisHelper)
      this.axisHelper = null
      this.eventDispatcher.dispatch('HELPER_AXIS_CHANGED', false)
    }
  }

  helperGrid(value: boolean) {
    if (value && this.gridHelper === null) {
      const size = this.getSceneBoundingSize()
      const max = Math.max(
        Math.abs(size.x),
        Math.abs(size.y),
        Math.abs(size.z),
        100
      )
      const gridHelper = new THREE.GridHelper(max * 2, max * 2)
      this.gridHelper = gridHelper
      this.data.add(gridHelper)
      this.eventDispatcher.dispatch('HELPER_GRID_CHANGED', true)
    }

    if (!value && this.gridHelper !== null) {
      this.data.remove(this.gridHelper)
      this.gridHelper = null
      this.eventDispatcher.dispatch('HELPER_GRID_CHANGED', false)
    }
  }

  getIsHelperAxisActive() {
    return this.axisHelper !== null
  }

  getIsHelperGridActive() {
    return this.gridHelper !== null
  }

  getSceneBoundingSize() {
    const box = new THREE.Box3()
    this.data.traverse(object => {
      box.expandByObject(object)
    })

    const size = new THREE.Vector3()
    box.getSize(size)
    return size
  }

  destroy() {
    this.eventDispatcher.removeListener('NEW_OBJECT_ADDED', this.updateHelper)
    this.eventDispatcher.removeListener('CHILD_DESTROY', this.updateHelper)
    this.eventDispatcher.removeListener(
      'CHILD_MOVE_TO_NEW_SCENE',
      this.updateHelper
    )
  }
}
