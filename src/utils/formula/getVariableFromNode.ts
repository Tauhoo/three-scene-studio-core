import { traverseNode } from './transverse'
import { FormulaNode } from './types'

export const getVariableFromNode = (node: FormulaNode): string[] => {
  const variables: Set<string> = new Set()

  traverseNode(node, node => {
    if (node.type === 'VARIABLE') {
      variables.add(node.name)
    }
  })
  return Array.from(variables)
}
