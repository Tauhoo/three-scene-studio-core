import * as THREE from 'three'
import Context from './utils/Context'
import Switcher from './utils/Switcher'
import { CameraObjectInfo, SceneObjectInfo } from './object'

class Renderer {
  renderer: THREE.WebGLRenderer
  cameraSwitcher: Switcher<CameraObjectInfo>
  sceneSwitcher: Switcher<SceneObjectInfo>

  constructor(
    context: Context,
    cameraSwitcher: Switcher<CameraObjectInfo>,
    sceneSwitcher: Switcher<SceneObjectInfo>
  ) {
    this.renderer = new THREE.WebGLRenderer()
    const rect = context.canvasContainer.getBoundingClientRect()
    this.renderer.setSize(rect.width, rect.height)
    this.renderer.setPixelRatio(context.window.devicePixelRatio)
    context.canvasContainer.appendChild(this.renderer.domElement)
    this.cameraSwitcher = cameraSwitcher
    this.sceneSwitcher = sceneSwitcher
  }

  render() {
    if (this.cameraSwitcher.current === null) return
    if (this.sceneSwitcher.current === null) return
    this.renderer.render(
      this.sceneSwitcher.current.data,
      this.cameraSwitcher.current.data
    )
  }
}

export default Renderer
