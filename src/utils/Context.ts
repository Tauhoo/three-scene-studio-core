import EventDispatcher, { EventPacket } from './EventDispatcher'

export type ContextEventPacket = EventPacket<
  'CANVAS_RESIZE',
  {
    width: number
    height: number
  }
>

class Context extends EventDispatcher<ContextEventPacket> {
  canvas: HTMLDivElement
  constructor(canvas: HTMLDivElement) {
    super()
    this.canvas = canvas
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        this.dispatch('CANVAS_RESIZE', { width, height })
        return
      }
    })
    resizeObserver.observe(canvas)
  }
}

export default Context
