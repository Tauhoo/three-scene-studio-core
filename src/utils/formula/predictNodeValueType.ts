import { functionMap } from './function'
import { FormulaNode, NodeValueType } from './types'

export type PredictInfo = {
  node: FormulaNode
  value: NodeValueType
}

export type PredictNodeValueTypeResult =
  | {
      status: 'SUCCESS'
      info: PredictInfo
    }
  | {
      status: 'FAIL'
      error: string
      problemNode: FormulaNode
    }

export const predictNodeValueType = (
  node: FormulaNode,
  variableChecker: (name: string) => NodeValueType | null
): PredictNodeValueTypeResult => {
  if (
    node.type === 'ADD' ||
    node.type === 'SUB' ||
    node.type === 'MUL' ||
    node.type === 'DIV' ||
    node.type === 'MOD'
  ) {
    const inputInfos: PredictInfo[] = []
    for (const input of node.inputs) {
      const validationResult = predictNodeValueType(input, variableChecker)
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      inputInfos.push(validationResult.info)
    }
    if (inputInfos.find(info => info.value === 'VECTOR') === undefined) {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'NUMBER',
        },
      }
    }
    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
  }

  if (node.type === 'VECTOR') {
    const items: PredictInfo[] = []
    for (const item of node.items) {
      const validationResult = predictNodeValueType(item, variableChecker)
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      items.push(validationResult.info)
    }
    const vectorItem = items.find(info => info.value === 'VECTOR')
    if (vectorItem !== undefined) {
      return {
        status: 'FAIL',
        error: "Vector can't be used as a vector item",
        problemNode: vectorItem.node,
      }
    }
    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'VECTOR',
      },
    }
  }

  if (node.type === 'FUNCTION') {
    const inputInfos: PredictInfo[] = []
    for (const input of node.inputs) {
      const validationResult = predictNodeValueType(input, variableChecker)
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      inputInfos.push(validationResult.info)
    }

    const funcInfo = functionMap.get(node.func)
    if (funcInfo === undefined) {
      return {
        status: 'FAIL',
        error: 'Unknown function',
        problemNode: node,
      }
    }

    for (const ioSchema of funcInfo.ioSchemas) {
      if (ioSchema.input.length !== inputInfos.length) {
        continue
      }

      let isPass = true
      for (let index = 0; index < ioSchema.input.length; index++) {
        const subIoSchema = ioSchema.input[index]
        const inputInfo = inputInfos[index]
        if (subIoSchema !== inputInfo.value) {
          isPass = false
          break
        }
      }
      if (isPass) {
        return {
          status: 'SUCCESS',
          info: {
            node: node,
            value: ioSchema.output,
          },
        }
      }
    }

    return {
      status: 'FAIL',
      error: 'Invalid function invocation',
      problemNode: node,
    }
  }

  if (node.type === 'IMP_MUL') {
    const inputInfos: PredictInfo[] = []
    for (const input of node.inputs) {
      const validationResult = predictNodeValueType(input, variableChecker)
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      inputInfos.push(validationResult.info)
    }
    const vectorItem = inputInfos.find(info => info.value === 'VECTOR')
    if (vectorItem !== undefined) {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'VECTOR',
        },
      }
    }

    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'NUMBER',
      },
    }
  }

  if (node.type === 'MINUS_PREFIX_UNARY') {
    return predictNodeValueType(node.input, variableChecker)
  }

  if (node.type === 'PARENTHESES_EXPRESSION') {
    if (node.expressions.length === 0) {
      return {
        status: 'FAIL',
        error: 'Empty parentheses expression is not allowed',
        problemNode: node,
      }
    }

    if (node.expressions.length === 1) {
      return predictNodeValueType(node.expressions[0], variableChecker)
    }

    return {
      status: 'FAIL',
      error: 'Parentheses expression can only contain one expression',
      problemNode: node,
    }
  }

  if (node.type === 'NUMBER') {
    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: 'NUMBER',
      },
    }
  }

  if (node.type === 'VARIABLE') {
    const variableCheckerResult = variableChecker(node.name)
    if (variableCheckerResult === null) {
      return {
        status: 'FAIL',
        error: 'Unknown variable',
        problemNode: node,
      }
    }

    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: variableCheckerResult,
      },
    }
  }

  return {
    status: 'FAIL',
    error: 'Unknown node type',
    problemNode: node,
  }
}
