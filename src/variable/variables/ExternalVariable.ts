import EventDispatcher from '../../utils/EventDispatcher'
import Variable, { VariableEventPacket } from '../Variable'

class ExternalVariable extends Variable<'EXTERNAL'> {
  constructor(id: string, name: string, value: number, ref: string) {
    const dispatcher = new EventDispatcher<VariableEventPacket>()
    super('EXTERNAL', id, name, value, ref, dispatcher)
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

export default ExternalVariable
