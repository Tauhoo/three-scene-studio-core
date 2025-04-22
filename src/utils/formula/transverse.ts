import { FormulaNode } from './types'

export const traverseNode = (
  currentNode: FormulaNode,
  callback: (node: FormulaNode) => void
) => {
  if (currentNode.type === 'VARIABLE') {
    callback(currentNode)
  }

  if (
    currentNode.type === 'ADD' ||
    currentNode.type === 'SUB' ||
    currentNode.type === 'MUL' ||
    currentNode.type === 'DIV' ||
    currentNode.type === 'MOD'
  ) {
    for (const input of currentNode.inputs) {
      traverseNode(input, callback)
    }
  }

  if (currentNode.type === 'VECTOR') {
    for (const item of currentNode.items) {
      traverseNode(item, callback)
    }
  }

  if (currentNode.type === 'FUNCTION') {
    for (const input of currentNode.inputs) {
      traverseNode(input, callback)
    }
  }

  if (currentNode.type === 'IMP_MUL') {
    for (const input of currentNode.inputs) {
      traverseNode(input, callback)
    }
  }

  if (currentNode.type === 'MINUS_PREFIX_UNARY') {
    traverseNode(currentNode.input, callback)
  }

  if (currentNode.type === 'PARENTHESES_EXPRESSION') {
    for (const expression of currentNode.expressions) {
      traverseNode(expression, callback)
    }
  }

  if (currentNode.type === 'NUMBER') {
    callback(currentNode)
  }

  if (currentNode.type === 'VARIABLE') {
    callback(currentNode)
  }

  if (currentNode.type === 'VECTOR_ITEM_SWIZZLE_EXTRACTION') {
    traverseNode(currentNode.vector, callback)
  }

  if (currentNode.type === 'VECTOR_ITEM_INDEX_EXTRACTION') {
    traverseNode(currentNode.vector, callback)
    for (const item of currentNode.items) {
      traverseNode(item, callback)
    }
  }
}
