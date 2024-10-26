export interface EventPacket<T extends string, D> {
  type: T
  data: D
}

type ListenerMap<P extends EventPacket<string, any>> = {
  [K in P['type']]?: ((
    data: P extends { type: K } ? P['data'] : never
  ) => void)[]
}

class EventDispatcher<P extends EventPacket<string, any>> {
  private listenerMap: ListenerMap<P> = {}

  dispatch<K extends P['type']>(
    type: K,
    data: P extends { type: K } ? P['data'] : never
  ) {
    if (this.listenerMap[type] === undefined) return
    this.listenerMap[type].forEach(listener => listener(data))
  }

  addListener<K extends P['type']>(
    type: K,
    listener: (data: P extends { type: K } ? P['data'] : never) => void
  ) {
    if (this.listenerMap[type]) {
      this.listenerMap[type].push(listener)
    } else {
      this.listenerMap[type] = [listener]
    }
  }

  removeListener<K extends P['type']>(
    type: K,
    listener: (data: P extends { type: K } ? P['data'] : never) => void
  ) {
    if (this.listenerMap[type]) {
      this.listenerMap[type] = this.listenerMap[type].filter(
        l => l !== listener
      )
    }
  }
}

export default EventDispatcher
