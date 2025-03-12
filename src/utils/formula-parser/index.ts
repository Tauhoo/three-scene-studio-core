import nearley from 'nearley'
import { default as grammar } from './grammar'
import { Expression } from 'typescript'

const grammarAny = grammar as any

export const parse = (input: string) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammarAny))
  parser.feed(input)
  return parser.finish()[0] as ExpressionNode
}

type ExpressionNode = NumberNode | UnaryOperatorNode

type NumberNode = {
  type: 'NUMBER'
  value: number
  text: string
}

type UnaryOperatorNode = PrefixUnaryNode

type PrefixUnaryNode = MinusPrefixUnaryNode

type MinusPrefixUnaryNode = {
  type: 'MINUS_PREFIX_UNARY'
  input: NumberNode
  text: '-'
}
