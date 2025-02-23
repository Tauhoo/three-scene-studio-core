import Context from './utils/Context'
import EventDispatcher, { EventPacket } from './utils/EventDispatcher'

export type ClockEventPacket = EventPacket<
  'TICK',
  {
    delta: number
  }
>

export class Clock extends EventDispatcher<ClockEventPacket> {
  active: boolean = false
  lastTime: number = 0

  constructor(private context: Context) {
    super()
    context.addListener('VISIBILITY_CHANGE', this.onVisibilityChange)
  }

  onVisibilityChange = ({ visible }: { visible: boolean }) => {
    if (visible) {
      this.start()
    } else {
      this.stop()
    }
  }

  start() {
    this.lastTime = Date.now()
    this.active = true
    requestAnimationFrame(this.update)
  }

  stop() {
    this.active = false
  }

  update = () => {
    if (!this.active) return
    const now = Date.now()
    const delta = now - this.lastTime
    this.dispatch('TICK', { delta })
    this.lastTime = now
    requestAnimationFrame(this.update)
  }

  destroy() {
    this.stop()
    this.context.removeListener('VISIBILITY_CHANGE', this.onVisibilityChange)
  }
}
