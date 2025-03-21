import { i } from 'mathjs'
import {
  ErrorResponse,
  errorResponse,
  SuccessResponse,
  successResponse,
} from '../response'
import { FormulaNode } from './types'

type FunctionInfo = {
  keyword: string
  input: ('number' | 'vector' | 'all')[]
  output: 'number' | 'vector' | 'all'
  func: (...args: any[]) => any
}

const functionInfos: FunctionInfo[] = [
  // function for both vector and number
  {
    keyword: 'sin',
    input: ['all'],
    output: 'all',
    func: Math.sin,
  },
  {
    keyword: 'cos',
    input: ['all'],
    output: 'all',
    func: Math.cos,
  },
  {
    keyword: 'tan',
    input: ['all'],
    output: 'all',
    func: Math.tan,
  },
  {
    keyword: 'abs',
    input: ['all'],
    output: 'all',
    func: Math.abs,
  },
  {
    keyword: 'mod',
    input: ['all', 'all'],
    output: 'all',
    func: (a, b) => a % b,
  },
  {
    keyword: 'atan',
    input: ['all'],
    output: 'all',
    func: Math.atan,
  },
  {
    keyword: 'floor',
    input: ['all'],
    output: 'all',
    func: Math.floor,
  },
  {
    keyword: 'ceil',
    input: ['all'],
    output: 'all',
    func: Math.ceil,
  },
  {
    keyword: 'pow',
    input: ['all', 'all'],
    output: 'all',
    func: Math.pow,
  },

  // function for vector
  {
    keyword: 'dot',
    input: ['vector', 'vector'],
    output: 'number',
    func: (a: number[], b: number[]) =>
      a.reduce((acc, curr, index) => acc + curr * b[index], 0),
  },
  {
    keyword: 'cross',
    input: ['vector', 'vector'],
    output: 'vector',
    func: (a: number[], b: number[]) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ],
  },
  {
    keyword: 'norm',
    input: ['vector'],
    output: 'vector',
    func: (a: number[]) => {
      const sum = a.reduce((acc, curr) => acc + curr * curr, 0)
      return a.map(v => v / Math.sqrt(sum))
    },
  },

  // utility functions
  {
    keyword: 'rand',
    input: [],
    output: 'number',
    func: () => Math.random(),
  },
]

export const functionMap = new Map(
  functionInfos.map(info => [info.keyword, info])
)

export const generateFunctionNode = (
  node: FormulaNode
): SuccessResponse<null> | ErrorResponse<'INVALID_FORMULA'> => {
  if (node.type === 'NUMBER') {
    return successResponse(null)
  }
  if (node.type === 'VARIABLE') {
    const functionInfo = functionMap.get(node.name)
    if (functionInfo !== undefined) {
      return errorResponse(
        'INVALID_FORMULA',
        `Can not use ${node.name} function without arguments`
      )
    }
    return successResponse(null)
  }
  if (node.type === 'VECTOR') {
    for (const item of node.items) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
    }
    return successResponse(null)
  }
  if (
    node.type === 'ADD' ||
    node.type === 'SUB' ||
    node.type === 'MUL' ||
    node.type === 'DIV' ||
    node.type === 'MOD'
  ) {
    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
    }
    return successResponse(null)
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
      node.inputs = mutatedInputs
      continue
    }

    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
    }
    return successResponse(null)
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    return generateFunctionNode(node.input)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    if (node.expressions.length === 0) {
      return errorResponse(
        'INVALID_FORMULA',
        'A parentheses expression is empty'
      )
    }

    if (node.expressions.length === 1) {
      return generateFunctionNode(node.expressions[0])
    }

    return errorResponse(
      'INVALID_FORMULA',
      'Multiple expressions in parentheses can be used for function invocation only'
    )
  }

  if (node.type === 'FUNCTION') {
    for (const item of node.inputs) {
      const result = generateFunctionNode(item)
      if (result.status === 'ERROR') {
        return result
      }
    }
    return successResponse(null)
  }

  return errorResponse('INVALID_FORMULA', 'Invalid node type')
}
