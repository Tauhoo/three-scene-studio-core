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
    this.renderer = new THREE.WebGLRenderer()
    const rect = context.canvasContainer.getBoundingClientRect()
    this.renderer.setSize(rect.width, rect.height)
    this.renderer.setPixelRatio(context.window.devicePixelRatio)
    context.canvasContainer.appendChild(this.renderer.domElement)
    this.cameraSwitcher = cameraSwitcher
    this.sceneSwitcher = sceneSwitcher

    clock.addListener('TICK', this.render)
    containerHeightVariable.dispatcher.addListener(
      'VALUE_CHANGED',
      this.onContainerResize
    )
    containerWidthVariable.dispatcher.addListener(
      'VALUE_CHANGED',
      this.onContainerResize
    )
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
    this._overrideCamera = camera
    this.dispatch('UPDATE_OVERRIDE_CAMERA', camera)
  }

  set overrideScene(scene: SceneObjectInfo | null) {
    this._overrideScene = scene
    this.dispatch('UPDATE_OVERRIDE_SCENE', scene)
  }

  render = () => {
    if (this.cameraSwitcher.current === null) return
    if (this.sceneSwitcher.current === null) return
    this.renderer.render(
      this.overrideScene
        ? this.overrideScene.data
        : this.sceneSwitcher.current.data,
      this.overrideCamera
        ? this.overrideCamera.data
        : this.cameraSwitcher.current.data
    )
  }
}

export default Renderer
