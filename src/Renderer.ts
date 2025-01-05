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
    this.renderer.setPixelRatio(context.window.devicePixelRatio)
    const rect = context.canvasContainer.getBoundingClientRect()
    this.renderer.setSize(rect.width, rect.height)
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
    const scene = this.overrideScene
      ? this.overrideScene
      : this.sceneSwitcher.current
    const camera = this.overrideCamera
      ? this.overrideCamera
      : this.cameraSwitcher.current

    if (scene === null || camera === null) return
    this.renderer.render(scene.data, camera.data)
  }
}

export default Renderer
