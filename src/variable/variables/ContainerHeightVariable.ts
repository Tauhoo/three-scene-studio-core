import EventDispatcher from '../../utils/EventDispatcher'
import Variable, { VariableEventPacket } from '../Variable'
class ContainerHeightVariable extends Variable<'CONTAINER_HEIGHT'> {
  constructor(id: string, name: string, value: number, ref: string) {
    const dispatcher = new EventDispatcher<VariableEventPacket>()
    super('CONTAINER_HEIGHT', id, name, value, ref, dispatcher)
  }

  serialize() {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      value: this.value,
      ref: this.ref,
    }
  }
}

export default ContainerHeightVariable
