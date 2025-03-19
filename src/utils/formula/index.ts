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
    const generateResult = generateFunctionNode(result)
    if (generateResult.status === 'ERROR') {
      return generateResult
    }
    return successResponse<FormulaNode>(result)
  } catch (error) {
    return errorResponse('INVALID_FORMULA', `${error}`)
  }
}
