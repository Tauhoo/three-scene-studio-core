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
})
