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

  constructor(context: Context) {
    super()
    context.addListener('VISIBILITY_CHANGE', ({ visible }) => {
      if (visible) {
        this.start()
      } else {
        this.stop()
      }
    })
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
}
