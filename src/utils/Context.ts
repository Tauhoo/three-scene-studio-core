import EventDispatcher, { EventPacket } from './EventDispatcher'

export type ContextEventPacket =
  | EventPacket<
      'CANVAS_RESIZE',
      {
        width: number
        height: number
      }
    >
  | EventPacket<'VISIBILITY_CHANGE', { visible: boolean }>
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
    // observe canvas resize
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        this.dispatch('CANVAS_RESIZE', { width, height })
        return
      }
    })
    resizeObserver.observe(this.canvasContainer)

    // observe visibility change
    window.document.addEventListener('visibilitychange', () => {
      if (window.document.hidden) {
        this.dispatch('VISIBILITY_CHANGE', { visible: false })
      } else {
        this.dispatch('VISIBILITY_CHANGE', { visible: true })
      }
    })
  }
}

export default Context
