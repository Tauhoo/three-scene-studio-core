import { parse } from '../parse'
import { predictNodeValueType } from '../predictNodeValueType'
import { FormulaNode } from '../types'

describe('predictNodeValueType', () => {
  const variableChecker = (name: string) => {
    if (name === 'x') return 'NUMBER'
    if (name === 'v') return 'VECTOR'
    return null
  }

  it('should return NUMBER for ADD node with NUMBER inputs', () => {
    const nodeParseResult = parse('1 + 2')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'NUMBER',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return VECTOR for ADD node with VECTOR inputs', () => {
    const nodeParseResult = parse('[1] + [2]')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return VECTOR for ADD node with VECTOR and NUMBER inputs', () => {
    const nodeParseResult = parse('[1, 2] + 2')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return error when VECTOR is inside VECTOR', () => {
    const problemNode: FormulaNode = {
      id: '4',
      type: 'VECTOR',
      items: [
        {
          id: '5',
          type: 'NUMBER',
          text: '2',
          value: 2,
        },
      ],
    }
    const node: FormulaNode = {
      id: '1',
      type: 'FUNCTION',
      func: 'sin',
      inputs: [
        {
          id: '2',
          type: 'VECTOR',
          items: [
            {
              id: '3',
              type: 'NUMBER',
              text: '1',
              value: 1,
            },
            problemNode,
          ],
        },
      ],
    }
    const expected = {
      status: 'FAIL',
      error: "Vector can't be used as a vector item",
      problemNode,
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return FAIL for empty parentheses expression', () => {
    const problemNode: FormulaNode = {
      id: '2',
      type: 'PARENTHESES_EXPRESSION',
      expressions: [],
    }
    const node: FormulaNode = {
      id: '1',
      type: 'ADD',
      inputs: [
        problemNode,
        {
          id: '3',
          type: 'NUMBER',
          text: '1',
          value: 1,
        },
      ],
    }
    const expected = {
      status: 'FAIL',
      error: 'Empty parentheses expression is not allowed',
      problemNode,
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return NUMBER for valid function invocation', () => {
    const nodeParseResult = parse('sin(1)')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'NUMBER',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return error when too many inputs for function', () => {
    const node: FormulaNode = {
      id: '2',
      type: 'FUNCTION',
      func: 'sin',
      inputs: [
        {
          id: '3',
          type: 'NUMBER',
          text: '1',
          value: 1,
        },
        {
          id: '4',
          type: 'NUMBER',
          text: '2',
          value: 2,
        },
      ],
    }
    const expected = {
      status: 'FAIL',
      error: 'Invalid sin function invocation',
      problemNode: node,
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return VECTOR for sin function with VECTOR input', () => {
    const nodeParseResult = parse('sin([1, x])')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return VECTOR for shorthand multiply between VECTOR and NUMBER', () => {
    const nodeParseResult = parse('[1, 2]2')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return VECTOR for minus prefix unary with VECTOR input', () => {
    const nodeParseResult = parse('-[1, 2][10, 2]')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return NUMBER for minus prefix unary with NUMBER input', () => {
    const nodeParseResult = parse('-2')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'NUMBER',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should return error for unknown variable', () => {
    const problemNode: FormulaNode = {
      id: '2',
      type: 'VARIABLE',
      name: 'x',
    }
    const node: FormulaNode = {
      id: '1',
      type: 'ADD',
      inputs: [
        problemNode,
        {
          id: '3',
          type: 'NUMBER',
          text: '1',
          value: 1,
        },
      ],
    }
    const expected = {
      status: 'FAIL',
      error: 'Unknown variable',
      problemNode,
    }
    const result = predictNodeValueType(node, () => null)
    expect(result).toEqual(expected)
  })

  // Complex cases

  it('should handle deeply nested operations with mixed types', () => {
    const nodeParseResult = parse('sin(2 * x + 3) * (4 + v)')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should handle complex vector operations with variables', () => {
    const nodeParseResult = parse('[2, 3] + sin([x, 2]) * v')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })

  it('should handle complex parentheses expressions with mixed operations', () => {
    const nodeParseResult = parse('((2 + x) * v) + (sin(x) * v)')
    if (nodeParseResult.status === 'ERROR') {
      throw new Error('Failed to parse formula')
    }
    const node = nodeParseResult.data
    const expected = {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
    const result = predictNodeValueType(node, variableChecker)
    expect(result).toEqual(expected)
  })
})
