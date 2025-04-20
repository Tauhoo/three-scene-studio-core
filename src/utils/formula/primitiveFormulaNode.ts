import { errorResponse, successResponse } from '../response'
import { FormulaNode } from './types'

export function primitiveFormulaNodeToString(node: FormulaNode) {
  if (node.type === 'NUMBER') {
    return successResponse(node.value)
  }

  if (node.type === 'VECTOR') {
    const result: string[] = []
    for (let item of node.items) {
      if (item.type === 'NUMBER') {
        result.push(item.value.toString())
      } else {
        return errorResponse(
          'INVALID_VECTOR_ITEM',
          'non number found in vector'
        )
      }
    }
    return successResponse(`[${result.join(',')}]`)
  }

  return errorResponse('INVALID_FORMULA_NODE', 'non primitive formula node')
}

export function convertPrimitiveFormulaNodeToJSValue(node: FormulaNode) {
  if (node.type === 'NUMBER') {
    return successResponse(node.value)
  }

  if (node.type === 'VECTOR') {
    const result: number[] = []
    for (let item of node.items) {
      if (item.type === 'NUMBER') {
        result.push(item.value)
      } else {
        return errorResponse(
          'INVALID_VECTOR_ITEM',
          'non number found in vector'
        )
      }
    }
    return successResponse(result)
  }

  return errorResponse('INVALID_FORMULA_NODE', 'non primitive formula node')
}
