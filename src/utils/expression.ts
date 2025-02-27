import * as math from 'mathjs'
import { errorResponse, successResponse } from './response'
import { v4 as uuidv4 } from 'uuid'

const knownFunctions = new Set(Object.keys(math))

type Info = {
  variables: string[]
  functions: string[]
}

function getInfoFromExpression(node: math.MathNode): Info {
  try {
    const variables = new Set<string>()
    const functions = new Set<string>()
    node.traverse(child => {
      if (child instanceof math.SymbolNode) {
        const name = child.toString()

        if (knownFunctions.has(name)) {
          functions.add(name)
        } else {
          variables.add(name)
        }
      }
    })
    return {
      variables: Array.from(variables),
      functions: Array.from(functions),
    }
  } catch (e) {
    return {
      variables: [],
      functions: [],
    }
  }
}

function startWith(source: string[], target: string) {
  return source.filter(item => item.startsWith(target))
}

export type ExpressionBlock = {
  id: string
  type: 'variable' | 'expression' | 'function'
  value: string
}

export interface FormulaInfo {
  blocks: ExpressionBlock[]
  variables: string[]
  node: math.MathNode
  expression: string
}

function expressionToBlock(
  expression: string,
  variables: string[],
  functions: string[]
): ExpressionBlock[] {
  let state: 'search' | 'process' = 'search'
  let accumNonSymbol = ''
  let accumSymbol = ''
  let symbolList = [...variables, ...functions]
  for (let index = 0; index < expression.length; index++) {
    const currentText = expression[index]

    if (state === 'process') {
      if (startWith(symbolList, accumSymbol + currentText).length > 0) {
        accumSymbol += currentText
      } else {
        break
      }
    } else if (state === 'search') {
      if (startWith(symbolList, accumSymbol + currentText).length > 0) {
        state = 'process'
        accumSymbol += currentText
      } else {
        accumNonSymbol += currentText
      }
    }
  }
  const nextExpression = expression.slice(
    accumNonSymbol.length + accumSymbol.length
  )

  const currentResult = [
    { type: 'expression', value: accumNonSymbol, id: uuidv4() },
    {
      type: knownFunctions.has(accumSymbol) ? 'function' : 'variable',
      value: accumSymbol,
      id: uuidv4(),
    },
  ].filter(value => value.value !== '') as ExpressionBlock[]

  if (nextExpression.length === 0) {
    return currentResult
  } else {
    return [
      ...currentResult,
      ...expressionToBlock(nextExpression, variables, functions),
    ]
  }
}

export function parseExpression(expression: string) {
  try {
    if (expression.trim() === '')
      return errorResponse('INVALID_EXPRESSION', 'Empty expression')
    const node = math.parse(expression)
    const info = getInfoFromExpression(node)
    const blocks = expressionToBlock(expression, info.variables, info.functions)
    return successResponse({
      blocks,
      variables: info.variables,
      node,
      expression,
    } as FormulaInfo)
  } catch (error) {
    return errorResponse('INVALID_EXPRESSION', 'Invalid expression')
  }
}
