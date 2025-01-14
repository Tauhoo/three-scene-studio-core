import * as math from 'mathjs'
import { errorResponse, successResponse } from './response'
import { v4 as uuidv4 } from 'uuid'

const knownFunctions = new Set(Object.keys(math))

function getVariablesFromExpression(node: math.MathNode): string[] {
  try {
    const variables = new Set<string>()
    node.traverse(child => {
      if (child instanceof math.SymbolNode) {
        variables.add(child.toString())
      }
    })
    return Array.from(variables).filter(v => !knownFunctions.has(v))
  } catch (e) {
    return []
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
  variables: string[]
): ExpressionBlock[] {
  let state: 'search' | 'process' = 'search'
  let accumNonVartiable = ''
  let accumVariable = ''
  for (let index = 0; index < expression.length; index++) {
    const currentText = expression[index]

    if (state === 'process') {
      if (startWith(variables, accumVariable + currentText).length > 0) {
        accumVariable += currentText
      } else {
        break
      }
    } else if (state === 'search') {
      if (startWith(variables, accumVariable + currentText).length > 0) {
        state = 'process'
        accumVariable += currentText
      } else {
        accumNonVartiable += currentText
      }
    }
  }
  const nextExpression = expression.slice(
    accumNonVartiable.length + accumVariable.length
  )

  const currentResult = [
    { type: 'expression', value: accumNonVartiable, id: uuidv4() },
    {
      type: knownFunctions.has(accumVariable) ? 'function' : 'variable',
      value: accumVariable,
      id: uuidv4(),
    },
  ].filter(value => value.value !== '') as ExpressionBlock[]

  if (nextExpression.length === 0) {
    return currentResult
  } else {
    return [...currentResult, ...expressionToBlock(nextExpression, variables)]
  }
}

export function parseExpression(expression: string) {
  try {
    if (expression.trim() === '')
      return errorResponse('INVALID_EXPRESSION', 'Empty expression')
    const node = math.parse(expression)
    const variables = getVariablesFromExpression(node)
    const blocks = expressionToBlock(expression, variables)
    return successResponse({
      blocks,
      variables,
      node,
      expression,
    } as FormulaInfo)
  } catch (error) {
    return errorResponse('INVALID_EXPRESSION', 'Invalid expression')
  }
}
