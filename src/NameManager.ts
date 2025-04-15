import { errorResponse, successResponse } from './utils'

class NameManager {
  private refSet: Set<string>

  constructor() {
    this.refSet = new Set()
  }

  hasRef(ref: string) {
    return this.refSet.has(ref)
  }

  addRef(ref: string) {
    if (this.hasRef(ref)) {
      return errorResponse('DUPLICATE_REF', 'Duplicate ref')
    }
    this.refSet.add(ref)
    return successResponse(null)
  }

  removeRef(ref: string) {
    this.refSet.delete(ref)
  }
}

export default NameManager
