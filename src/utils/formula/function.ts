import {
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from '../response'
import { FormulaNode } from './types'

type FunctionInfo = {
  keyword: string
  inputLength: number
  func: (...args: any[]) => any
}

export const functionInfos: FunctionInfo[] = [
  // function for both vector and number
  {
    keyword: 'sin',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.sin(a) : a.map(Math.sin),
  },
  {
    keyword: 'cos',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.cos(a) : a.map(Math.cos),
  },
  {
    keyword: 'tan',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.tan(a) : a.map(Math.tan),
  },
  {
    keyword: 'abs',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.abs(a) : a.map(Math.abs),
  },
  {
    keyword: 'mod',
    inputLength: 2,
    func: (a, b) => a % b, // TODO: handle vector
  },
  {
    keyword: 'atan',
    inputLength: 2,
    func: (a, b) => Math.atan(a, b), // TODO: handle vector
  },
  {
    keyword: 'floor',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.floor(a) : a.map(Math.floor),
  },
  {
    keyword: 'ceil',
    inputLength: 1,
    func: (a: number | number[]) =>
      typeof a === 'number' ? Math.ceil(a) : a.map(Math.ceil),
  },
  {
    keyword: 'pow',
    inputLength: 2,
    func: Math.pow, // handle vector
  },

  // function for vector
  {
    keyword: 'dot',
    inputLength: 2,
    func: (a: number[], b: number[]) =>
      a.reduce((acc, curr, index) => acc + curr * b[index], 0),
  },
  {
    keyword: 'cross',
    inputLength: 2,
    func: (a: number[], b: number[]) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ],
  },
  {
    keyword: 'norm',
    inputLength: 1,
    func: (a: number[]) => {
      const sum = a.reduce((acc, curr) => acc + curr * curr, 0)
      return a.map(v => v / Math.sqrt(sum))
    },
  },

  // utility functions
  {
    keyword: 'rand',
    inputLength: 0,
    func: () => Math.random(),
  },
]

export const functionMap = new Map(
  functionInfos.map(info => [info.keyword, info])
)

export const generateFunctionNode = (
  node: FormulaNode
): SuccessResponse<FormulaNode> | ErrorResponse<'INVALID_FORMULA'> => {
  if (node.type === 'NUMBER') {
    return successResponse(node)
  }

  if (node.type === 'VARIABLE') {
    const functionInfo = functionMap.get(node.name)
    if (functionInfo !== undefined) {
      return errorResponse(
        'INVALID_FORMULA',
        `Can not use ${node.name} function without arguments`
      )
    }
    return successResponse(node)
  }

  if (node.type === 'VECTOR') {
    const mutatedItems: FormulaNode[] = []
    for (const item of node.items) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
      mutatedItems.push(result.data)
    }
    node.items = mutatedItems
    return successResponse(node)
  }

  if (
    node.type === 'ADD' ||
    node.type === 'SUB' ||
    node.type === 'MUL' ||
    node.type === 'DIV' ||
    node.type === 'MOD'
  ) {
    const mutatedInputs: FormulaNode[] = []
    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
      mutatedInputs.push(result.data)
    }
    node.inputs = mutatedInputs as [FormulaNode, FormulaNode]
    return successResponse(node)
  }

  if (node.type === 'IMP_MUL') {
    const mutatedInputs: FormulaNode[] = []
    for (const item of node.inputs) {
      const last = mutatedInputs.pop()
      if (last === undefined) {
        mutatedInputs.push(item)
        continue
      }

      if (last.type !== 'VARIABLE') {
        mutatedInputs.push(last)
        mutatedInputs.push(item)
        continue
      }
      const functionInfo = functionMap.get(last.name)
      if (functionInfo === undefined) {
        mutatedInputs.push(last)
        mutatedInputs.push(item)
        continue
      }

      if (item.type !== 'PARENTHESES_EXPRESSION') {
        mutatedInputs.push(last)
        mutatedInputs.push(item)
        continue
      }
      if (functionInfo.input.length !== item.expressions.length) {
        return errorResponse(
          'INVALID_FORMULA',
          `Function ${last.name} requires ${functionInfo.input.length} arguments, but ${item.expressions.length} were provided`
        )
      }
      mutatedInputs.push({
        type: 'FUNCTION',
        func: functionInfo.keyword,
        inputs: item.expressions,
      })
      continue
    }
    node.inputs = mutatedInputs

    const mutatedFunctionNodes: FormulaNode[] = []
    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
      mutatedFunctionNodes.push(result.data)
    }
    node.inputs = mutatedFunctionNodes

    if (node.inputs.length === 1) {
      return successResponse(node.inputs[0])
    }
    return successResponse(node)
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    const result = generateFunctionNode(node.input)
    if (result.status === 'ERROR') {
      return result
    }
    node.input = result.data
    return successResponse(node)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    if (node.expressions.length === 0) {
      return errorResponse(
        'INVALID_FORMULA',
        'A parentheses expression is empty'
      )
    }

    if (node.expressions.length === 1) {
      const result = generateFunctionNode(node.expressions[0])
      if (result.status === 'ERROR') {
        return result
      }
      node.expressions = [result.data]
      return successResponse(node)
    }

    return errorResponse(
      'INVALID_FORMULA',
      'Multiple expressions in parentheses can be used for function invocation only'
    )
  }

  if (node.type === 'FUNCTION') {
    const mutatedInputs: FormulaNode[] = []
    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
      mutatedInputs.push(result.data)
    }
    node.inputs = mutatedInputs
    return successResponse(node)
  }

  return errorResponse('INVALID_FORMULA', 'Invalid node type')
}
