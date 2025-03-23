import nearley from 'nearley'
import { default as grammar } from './grammar'
import { errorResponse, successResponse } from '../response'
import { FormulaNode } from './types'
import { generateFunctionNode } from './function'

const grammarAny = grammar as any

export const parse = (input: string) => {
  try {
    const cleanedInput = input.replace(/\s+/g, '')
    const parser = new nearley.Parser(
      nearley.Grammar.fromCompiled(grammarAny),
      {}
    )
    parser.feed(cleanedInput)
    const parsedResult = parser.finish()
    const result = parsedResult[0]
    const resultWithFunctionNode = generateFunctionNode(result)
    if (resultWithFunctionNode.status === 'ERROR') {
      return resultWithFunctionNode
    }
    cleanParseResult(resultWithFunctionNode.data)
    return resultWithFunctionNode
  } catch (error) {
    return errorResponse('INVALID_FORMULA', `${error}`)
  }
}

const cleanParseResult = (node: FormulaNode) => {
  if (
    node.type === 'ADD' ||
    node.type === 'SUB' ||
    node.type === 'MUL' ||
    node.type === 'DIV' ||
    node.type === 'MOD'
  ) {
    const newInputs: FormulaNode[] = []
    for (const input of node.inputs) {
      if (input.type === node.type) {
        newInputs.push(...input.inputs)
      } else {
        newInputs.push(input)
      }
    }
    node.inputs = newInputs
  }

  if (node.type === 'VECTOR') {
    for (const item of node.items) {
      cleanParseResult(item)
    }
  }

  if (node.type === 'FUNCTION') {
    for (const input of node.inputs) {
      cleanParseResult(input)
    }
  }

  if (node.type === 'IMP_MUL') {
    for (const input of node.inputs) {
      cleanParseResult(input)
    }
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    cleanParseResult(node.input)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    for (const input of node.expressions) {
      cleanParseResult(input)
    }
  }
}
