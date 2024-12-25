import EventDispatcher, { EventPacket } from './EventDispatcher'

export type ContextEventPacket = EventPacket<
  'CANVAS_RESIZE',
  {
    width: number
    height: number
  }
>

class Context extends EventDispatcher<ContextEventPacket> {
  canvasContainer: HTMLDivElement
  window: Window
  constructor(window: Window, canvasContainer?: HTMLDivElement) {
    super()
    this.canvasContainer =
      canvasContainer ?? window.document.createElement('div')
    this.window = window
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
