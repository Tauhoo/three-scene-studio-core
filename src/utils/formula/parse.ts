import nearley from 'nearley'
import grammar from './grammar'
import { errorResponse } from '../response'
import { FormulaNode } from './types'
import { generateFunctionNode } from './function'

export const parse = (input: string) => {
  try {
    // Remove all whitespace characters
    const cleanedInput = input.replace(/\s+/g, '')

    // Parse the cleaned input
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {})
    parser.feed(cleanedInput)
    const parsedResult = parser.finish()
    const result = parsedResult[0]

    // Generate function node
    const resultWithFunctionNode = generateFunctionNode(result)
    if (resultWithFunctionNode.status === 'ERROR') {
      return resultWithFunctionNode
    }

    // Group binary operator input
    groupBinaryOperatorInput(resultWithFunctionNode.data)

    // Return the result
    return resultWithFunctionNode
  } catch (error) {
    return errorResponse('INVALID_FORMULA', `${error}`)
  }
}

const groupBinaryOperatorInput = (node: FormulaNode) => {
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
      groupBinaryOperatorInput(item)
    }
  }

  if (node.type === 'FUNCTION') {
    for (const input of node.inputs) {
      groupBinaryOperatorInput(input)
    }
  }

  if (node.type === 'IMP_MUL') {
    for (const input of node.inputs) {
      groupBinaryOperatorInput(input)
    }
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    groupBinaryOperatorInput(node.input)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    for (const input of node.expressions) {
      groupBinaryOperatorInput(input)
    }
  }

  if (node.type === 'VECTOR_ITEM_SWIZZLE_EXTRACTION') {
    groupBinaryOperatorInput(node.vector)
  }

  if (node.type === 'VECTOR_ITEM_INDEX_EXTRACTION') {
    groupBinaryOperatorInput(node.vector)
    for (const item of node.items) {
      groupBinaryOperatorInput(item)
    }
  }
}
