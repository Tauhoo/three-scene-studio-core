import * as THREE from 'three'
import Context from './utils/Context'
import Switcher from './utils/Switcher'
import { CameraObjectInfo, SceneObjectInfo } from './object'
import { Clock } from './Clock'
import EventDispatcher, { EventPacket } from './utils/EventDispatcher'
import { ContainerHeightVariable, ContainerWidthVariable } from './variable'

type RendererEventPacket =
  | EventPacket<'UPDATE_OVERRIDE_CAMERA', CameraObjectInfo | null>
  | EventPacket<'UPDATE_OVERRIDE_SCENE', SceneObjectInfo | null>
  | EventPacket<'ACTIVE_SCENE_CHANGED', SceneObjectInfo | null>
  | EventPacket<'ACTIVE_CAMERA_CHANGED', CameraObjectInfo | null>

class Renderer extends EventDispatcher<RendererEventPacket> {
  renderer: THREE.WebGLRenderer
  cameraSwitcher: Switcher<CameraObjectInfo>
  sceneSwitcher: Switcher<SceneObjectInfo>
  context: Context

  private _overrideCamera: CameraObjectInfo | null = null
  private _overrideScene: SceneObjectInfo | null = null

  constructor(
    context: Context,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>,
    containerHeightVariable: ContainerHeightVariable,
    containerWidthVariable: ContainerWidthVariable,
    clock: Clock
  ) {
    super()
    this.context = context
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setClearColor(0x000000, 0)

    this.renderer.setPixelRatio(context.window.devicePixelRatio)
    const rect = context.canvasContainer.getBoundingClientRect()
    this.renderer.setSize(rect.width, rect.height)
    context.canvasContainer.appendChild(this.renderer.domElement)
    this.cameraSwitcher = cameraSwitcher
    this.sceneSwitcher = sceneSwitcher

    clock.addListener('TICK', ({ delta }) => {
      this.render()
      const activeScene = this.getActiveScene()
      if (activeScene) {
        activeScene.animationMixer.update(0)
      }
    })
    containerHeightVariable.dispatcher.addListener(
      'VALUE_CHANGED',
      this.onContainerResize
    )
    containerWidthVariable.dispatcher.addListener(
      'VALUE_CHANGED',
      this.onContainerResize
    )

    this.sceneSwitcher.addListener('INDEX_CHANGE', ({ from, to }) => {
      if (this._overrideScene === null) {
        this.dispatch('ACTIVE_SCENE_CHANGED', this.sceneSwitcher.values[to])
      }
    })

    this.cameraSwitcher.addListener('INDEX_CHANGE', ({ from, to }) => {
      if (this._overrideCamera === null) {
        this.dispatch('ACTIVE_CAMERA_CHANGED', this.cameraSwitcher.values[to])
      }
    })
  }

  private onContainerResize = () => {
    const rect = this.context.canvasContainer.getBoundingClientRect()
    this.renderer.setSize(rect.width, rect.height)
  }

  get overrideCamera() {
    return this._overrideCamera
  }

  get overrideScene() {
    return this._overrideScene
  }

  set overrideCamera(camera: CameraObjectInfo | null) {
    if (camera === this._overrideCamera) return
    this._overrideCamera = camera
    this.dispatch('UPDATE_OVERRIDE_CAMERA', camera)
    this.dispatch('ACTIVE_CAMERA_CHANGED', camera)
  }

  set overrideScene(scene: SceneObjectInfo | null) {
    if (scene === this._overrideScene) return
    this._overrideScene = scene
    this.dispatch('UPDATE_OVERRIDE_SCENE', scene)
    this.dispatch('ACTIVE_SCENE_CHANGED', scene)
  }

  getActiveScene = () => {
    return this.overrideScene ?? this.sceneSwitcher.current
  }

  getActiveCamera = () => {
    return this.overrideCamera ?? this.cameraSwitcher.current
  }

  render = () => {
    const scene = this.getActiveScene()
    const camera = this.getActiveCamera()

    if (scene === null || camera === null) {
      this.renderer.clear()
      return
    }
    this.renderer.render(scene.data, camera.data)
  }
}

export default Renderer
