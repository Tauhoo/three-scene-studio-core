import { errorResponse, successResponse } from '../response'
import { FormulaNode } from './types'

export type ExpressionBlock = {
  type: 'EXPRESSION'
  text: string
}

export type VariableBlock = {
  type: 'VARIABLE'
  name: string
}

export type FunctionBlock = {
  type: 'FUNCTION'
  func: string
}

export type Block = ExpressionBlock | VariableBlock | FunctionBlock

export const getBlocks = (formularText: string, node: FormulaNode) => {
  const blocks = getBlocksFromNode(node)

  let index = 0
  const result: Block[] = []
  for (const block of blocks) {
    let text = ''
    if (block.type === 'EXPRESSION') {
      text = block.text
    }
    if (block.type === 'VARIABLE') {
      text = block.name
    }
    if (block.type === 'FUNCTION') {
      text = block.func
    }
    const foundIndex = formularText.indexOf(text, index)
    if (foundIndex === -1) {
      return errorResponse('NODE_TEXT_MISMATCH', `text and node are not match`)
    }
    if (index !== foundIndex) {
      const spaceText = formularText.slice(index, foundIndex)
      result.push({ type: 'EXPRESSION', text: spaceText })
    }
    result.push(block)
    index = foundIndex + text.length
  }

  // group expression blocks
  const groupedResult: Block[] = []
  for (const block of result) {
    if (block.type === 'EXPRESSION') {
      const last = groupedResult.pop()
      if (last !== undefined && last.type === 'EXPRESSION') {
        groupedResult.push({
          type: 'EXPRESSION',
          text: last.text + block.text,
        })
      } else {
        if (last !== undefined) {
          groupedResult.push(last)
        }
        groupedResult.push(block)
      }
    } else {
      groupedResult.push(block)
    }
  }
  return successResponse(groupedResult)
}

export const getBlocksFromNode = (node: FormulaNode): Block[] => {
  if (node.type === 'ADD') {
    const result: Block[] = []
    for (let i = 0; i < node.inputs.length; i++) {
      const input = node.inputs[i]
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: '+' })
      }
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  if (node.type === 'SUB') {
    const result: Block[] = []
    for (let i = 0; i < node.inputs.length; i++) {
      const input = node.inputs[i]
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: '-' })
      }
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  if (node.type === 'DIV') {
    const result: Block[] = []
    for (let i = 0; i < node.inputs.length; i++) {
      const input = node.inputs[i]
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: '/' })
      }
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  if (node.type === 'MUL') {
    const result: Block[] = []
    for (let i = 0; i < node.inputs.length; i++) {
      const input = node.inputs[i]
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: '*' })
      }
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  if (node.type === 'MOD') {
    const result: Block[] = []
    for (let i = 0; i < node.inputs.length; i++) {
      const input = node.inputs[i]
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: '%' })
      }
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  if (node.type === 'NUMBER') {
    return [{ type: 'EXPRESSION', text: node.text }]
  }

  if (node.type === 'VARIABLE') {
    return [{ type: 'VARIABLE', name: node.name }]
  }

  if (node.type === 'FUNCTION') {
    const result: Block[] = [
      { type: 'FUNCTION', func: node.func },
      { type: 'EXPRESSION', text: '(' },
    ]
    for (let i = 0; i < node.inputs.length; i++) {
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: ',' })
      }
      result.push(...getBlocksFromNode(node.inputs[i]))
    }
    result.push({ type: 'EXPRESSION', text: ')' })
    return result
  }

  if (node.type === 'VECTOR') {
    const result: Block[] = [{ type: 'EXPRESSION', text: '[' }]
    for (let i = 0; i < node.items.length; i++) {
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: ',' })
      }
      result.push(...getBlocksFromNode(node.items[i]))
    }
    result.push({ type: 'EXPRESSION', text: ']' })
    return result
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    const result: Block[] = [{ type: 'EXPRESSION', text: '(' }]
    for (let i = 0; i < node.expressions.length; i++) {
      if (i !== 0) {
        result.push({ type: 'EXPRESSION', text: ',' })
      }
      result.push(...getBlocksFromNode(node.expressions[i]))
    }
    result.push({ type: 'EXPRESSION', text: ')' })
    return result
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    return [{ type: 'EXPRESSION', text: '-' }, ...getBlocksFromNode(node.input)]
  }

  if (node.type === 'IMP_MUL') {
    const result: Block[] = []
    for (const input of node.inputs) {
      result.push(...getBlocksFromNode(input))
    }
    return result
  }

  return []
}
