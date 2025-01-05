import EventDispatcher, { EventPacket } from './EventDispatcher'

export type ContextEventPacket =
  | EventPacket<
      'CANVAS_RESIZE',
      {
        width: number
        height: number
      }
    >
  | EventPacket<'CHANGE_CANVAS_CONTAINER', Context>

class Context extends EventDispatcher<ContextEventPacket> {
  canvasContainer: HTMLDivElement
  window: Window

  getDefaultCanvasContainer(window: Window) {
    const elem = window.document.createElement('div')
    elem.style.width = '100%'
    elem.style.height = '100%'
    return elem
  }

  constructor(window: Window, canvasContainer?: HTMLDivElement) {
    super()
    this.window = window
    this.canvasContainer =
      canvasContainer ?? this.getDefaultCanvasContainer(window)
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        this.dispatch('CANVAS_RESIZE', { width, height })
        return
      }
    })
    resizeObserver.observe(this.canvasContainer)
  }
}

export default Context
