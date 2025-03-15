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
  return result[0] as Expression
}

type Expression = {
  type: 'VECTOR_EXPRESSION' | 'NUMBER_EXPRESSION'
  expression: ExpressionNode
}

type ExpressionNode =
  | NumberNode
  | VectorNode
  | UnaryOperatorNode
  | BinaryOperatorNode
  | ParenthesesNode

type NumberNode = {
  type: 'NUMBER'
  value: number
}

type VectorNode = {
  type: 'VECTOR'
  items: ExpressionNode[]
}

type ParenthesesNode = {
  type: 'PARENTHESES_EXPRESSION'
  expression: ExpressionNode
}

type UnaryOperatorNode = {
  type: 'MINUS_PREFIX_UNARY'
  input: ExpressionNode
}

type BinaryOperatorNode =
  | AddBinaryNode
  | SubBinaryNode
  | MulBinaryNode
  | DivBinaryNode
  | ModBinaryNode

type AddBinaryNode = {
  type: 'ADD_BINARY'
  inputs: [ExpressionNode, ExpressionNode]
}

type SubBinaryNode = {
  type: 'SUB_BINARY'
  inputs: [ExpressionNode, ExpressionNode]
}

type MulBinaryNode = {
  type: 'MUL_BINARY'
  inputs: [ExpressionNode, ExpressionNode]
}

type DivBinaryNode = {
  type: 'DIV_BINARY'
  inputs: [ExpressionNode, ExpressionNode]
}

type ModBinaryNode = {
  type: 'MOD_BINARY'
  inputs: [ExpressionNode, ExpressionNode]
}
