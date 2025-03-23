import {
  errorResponse,
  ErrorResponse,
  SuccessResponse,
  successResponse,
} from '../response'
import { functionMap } from './function'
import { BinaryOperationNode, FormulaNode } from './types'

export type Parameter =
  | {
      type: 'NUMBER'
      name: string
      value: number
    }
  | {
      type: 'VECTOR'
      name: string
      value: number[]
    }

export type Parameters = Record<string, Parameter>

export function calculate(
  node: FormulaNode,
  variables: Parameters
): SuccessResponse<number | number[]> | ErrorResponse<string> {
  // Handle different node types
  if (node.type === 'NUMBER') {
    return successResponse(node.value)
  }

  if (node.type === 'VARIABLE') {
    const variable = variables[node.name]
    if (variable === undefined) {
      return errorResponse(
        'VARIABLE_NOT_FOUND',
        `Variable ${node.name} not found`
      )
    }
    return successResponse(variable.value)
  }

  if (node.type === 'VECTOR') {
    const result: number[] = []
    for (const item of node.items) {
      const subResult = calculate(item, variables)
      if (subResult.status === 'ERROR') {
        return subResult
      }
      if (Array.isArray(subResult.data)) {
        return errorResponse(
          'VECTOR_NOT_ALLOWED',
          'Vector is not allowed in vector'
        )
      }
      result.push(subResult.data)
    }
    return successResponse(result)
  }

  if (node.type === 'FUNCTION') {
    const args: (number | number[])[] = []
    for (const input of node.inputs) {
      const result = calculate(input, variables)
      if (result.status === 'ERROR') {
        return result
      }
      args.push(result.data)
    }

    const func = functionMap.get(node.func)
    if (func === undefined) {
      return errorResponse(
        'INVALID_FORMULA',
        `Function ${node.func} is invalid`
      )
    }

    try {
      return successResponse<number | number[]>(func.func(...args))
    } catch (error) {
      return errorResponse('CALCULATE_ERROR', `${error}`)
    }
  }

  if (
    node.type === 'ADD' ||
    node.type === 'SUB' ||
    node.type === 'MUL' ||
    node.type === 'DIV' ||
    node.type === 'MOD'
  ) {
    let result: number | number[] | null = null

    for (const input of node.inputs) {
      const subResult = calculate(input, variables)
      if (subResult.status === 'ERROR') {
        return subResult
      }

      if (result === null) {
        result = subResult.data
        continue
      }

      result = calculateBinaryOperator(result, node.type, subResult.data)
    }

    return successResponse(result ?? 0)
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    const value = calculate(node.input, variables)
    if (value.status === 'ERROR') {
      return value
    }
    if (Array.isArray(value.data)) {
      return successResponse(value.data.map(v => -1 * v))
    }
    return successResponse(-1 * value.data)
  }

  if (node.type === 'IMP_MUL') {
    let result: number | number[] | null = null
    for (const input of node.inputs) {
      const subResult = calculate(input, variables)
      if (subResult.status === 'ERROR') {
        return subResult
      }
      if (result === null) {
        result = subResult.data
        continue
      }

      result = calculateBinaryOperator(result, 'MUL', subResult.data)
    }
    return successResponse(result ?? 0)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    if (node.expressions.length !== 1) {
      return errorResponse(
        'INVALID_PARENTHESES_EXPRESSION',
        'Parentheses must have exactly one expression'
      )
    }
    return calculate(node.expressions[0], variables)
  }

  return errorResponse('UNKNOWN_NODE_TYPE', `Unknown node type: ${node.type}`)
}

const calculateBinaryOperatorForNumber = (
  a: number,
  operator: BinaryOperationNode['type'],
  b: number
) => {
  if (operator === 'ADD') {
    return a + b
  } else if (operator === 'SUB') {
    return a - b
  } else if (operator === 'MUL') {
    return a * b
  } else if (operator === 'DIV') {
    return a / b
  } else if (operator === 'MOD') {
    return a % b
  }
}

const calculateBinaryOperator = (
  a: number | number[],
  operator: BinaryOperationNode['type'],
  b: number | number[]
): number | number[] => {
  if (typeof a === 'number' && typeof b === 'number') {
    return calculateBinaryOperatorForNumber(a, operator, b) as number
  }

  if (typeof a === 'number' && Array.isArray(b)) {
    return b.map(v =>
      calculateBinaryOperatorForNumber(a, operator, v)
    ) as number[]
  }

  if (Array.isArray(a) && typeof b === 'number') {
    return a.map(v =>
      calculateBinaryOperatorForNumber(v, operator, b)
    ) as number[]
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((v, index) =>
      calculateBinaryOperator(v, operator, b[index] ?? 0)
    ) as number[]
  }

  return 0
}
