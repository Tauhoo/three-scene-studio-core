import {
  errorResponse,
  ErrorResponse,
  SuccessResponse,
  successResponse,
} from '../response'
import { functionMap } from './function'
import { FormulaNode } from './types'

export const toVector = (value: number | number[]): number[] => {
  if (Array.isArray(value)) return value
  return [value]
}

export const toNumber = (value: number | number[]): number => {
  if (Array.isArray(value)) return value[0] ?? 0
  return value
}

const getVariableValue = (
  name: string,
  variables: Record<string, number | number[]>
): number | number[] => {
  const value = variables[name]
  if (value === undefined) {
    return 0
  }
  return value
}

export function calculate(
  node: FormulaNode,
  variables: Record<string, number | number[]>
): SuccessResponse<number | number[]> | ErrorResponse<string> {
  // Handle different node types
  if (node.type === 'NUMBER') {
    return successResponse(node.value)
  }

  if (node.type === 'VARIABLE') {
    return successResponse(getVariableValue(node.name, variables))
  }

  if (node.type === 'VECTOR') {
    const result: number[] = []
    for (const item of node.items) {
      const subResult = calculate(item, variables)
      if (subResult.status === 'ERROR') {
        return subResult
      }
      result.push(toNumber(subResult.data))
    }
    return successResponse(result)
  }

  if (node.type === 'FUNCTION') {
    const functionInfo = functionMap.get(node.func)
    if (!functionInfo) {
      return errorResponse(
        'FUNCTION_NOT_FOUND',
        `Function ${node.func} not found`
      )
    }

    const args: (number | number[])[] = []
    for (const input of node.inputs) {
      const result = calculate(input, variables)
      if (result.status === 'ERROR') {
        return result
      }
      args.push(result.data)
    }

    // Convert types based on function input requirements
    const convertedArgs = args.map((arg, index) => {
      const expectedType = functionInfo.input[index]
      if (expectedType === 'number') return toNumber(arg)
      if (expectedType === 'vector') return toVector(arg)
      return arg // 'all' type
    })

    return successResponse<number | number[]>(
      functionInfo.func(...convertedArgs)
    )
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

      if (typeof result === 'number' && typeof subResult.data === 'number') {
        if (node.type === 'ADD') {
          result = result + subResult.data
        } else if (node.type === 'SUB') {
          result = result - subResult.data
        } else if (node.type === 'MUL') {
          result = result * subResult.data
        } else if (node.type === 'DIV') {
          result = result / subResult.data
        } else if (node.type === 'MOD') {
          result = result % subResult.data
        }
      } else {
        const resultVec = toVector(result)
        const dataVec = toVector(subResult.data)
        const resultLength = Math.max(resultVec.length, dataVec.length)

        const calResult: number[] = []
        for (let index = 0; index < resultLength; index++) {
          const elementA = resultVec[index] ?? 0
          const elementB = dataVec[index] ?? 0
          if (node.type === 'ADD') {
            calResult.push(elementA + elementB)
          } else if (node.type === 'SUB') {
            calResult.push(elementA - elementB)
          } else if (node.type === 'MUL') {
            calResult.push(elementA * elementB)
          } else if (node.type === 'DIV') {
            calResult.push(elementA / elementB)
          } else if (node.type === 'MOD') {
            calResult.push(elementA % elementB)
          }
        }
        result = calResult
      }
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

      if (typeof result === 'number' && typeof subResult.data === 'number') {
        result = result * subResult.data
      } else {
        const resultVec = toVector(result)
        const dataVec = toVector(subResult.data)
        const resultLength = Math.max(resultVec.length, dataVec.length)
        const calResult: number[] = []
        for (let index = 0; index < resultLength; index++) {
          const elementA = resultVec[index] ?? 0
          const elementB = dataVec[index] ?? 0
          calResult.push(elementA * elementB)
        }
        result = calResult
      }
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
