import EventDispatcher from '../../utils/EventDispatcher'
import Variable, { VariableEventPacket } from '../Variable'
class ContainerWidthVariable extends Variable<'CONTAINER_WIDTH'> {
  constructor(id: string, name: string, value: number, ref: string) {
    const dispatcher = new EventDispatcher<VariableEventPacket>()
    super('CONTAINER_WIDTH', id, name, value, ref, dispatcher)
  }

  serialize() {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
      x: 1,
    }
  }
}

export default ContainerWidthVariable
