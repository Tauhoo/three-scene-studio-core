import { traverseNode } from './transverse'
import { FormulaNode } from './types'

export const getVariableFromNode = (node: FormulaNode): string[] => {
  const variables: string[] = []

  traverseNode(node, node => {
    if (node.type === 'VARIABLE') {
      variables.push(node.name)
    }
  })
  return variables
}
