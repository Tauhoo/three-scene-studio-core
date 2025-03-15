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
  console.log('DEBUG: ', input, '=>', result.length) // JSON.stringify(result, null, 2))

  return result[0]
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
