import nearley from 'nearley'
import { default as grammar } from './grammar'

const grammarAny = grammar as any

export const parse = (input: string) => {
  const cleanedInput = input.replace(/\s+/g, '')
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(grammarAny),
    {}
  )
  parser.feed(cleanedInput)
  const result = parser.finish()
  return result[0] as FormulaNode
}
export interface NumberNode {
  type: 'NUMBER'
  value: number
  text: string
}

export interface VariableNode {
  type: 'VARIABLE'
  name: string
}

export interface VectorNode {
  type: 'VECTOR'
  items: FormulaNode[]
}

export interface BinaryOperationNode {
  type: 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MOD'
  inputs: FormulaNode[]
}

export interface ImplicitMultiplicationNode {
  type: 'IMP_MUL'
  inputs: FormulaNode[]
}

export interface MinusPrefixUnaryNode {
  type: 'MINUS_PREFIX_UNARY'
  input: FormulaNode
}

export interface ParenthesesExpressionNode {
  type: 'PARENTHESES_EXPRESSION'
  expression: FormulaNode
}

export type FormulaNode =
  | NumberNode
  | VariableNode
  | VectorNode
  | BinaryOperationNode
  | ImplicitMultiplicationNode
  | MinusPrefixUnaryNode
  | ParenthesesExpressionNode
