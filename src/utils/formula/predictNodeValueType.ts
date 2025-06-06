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
      error: `Invalid ${node.func} function invocation`,
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
    const validationResult = predictNodeValueType(node.input, variableChecker)
    if (validationResult.status === 'FAIL') {
      return validationResult
    }
    return {
      status: 'SUCCESS',
      info: {
        node: node,
        value: validationResult.info.value,
      },
    }
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
      const validationResult = predictNodeValueType(
        node.expressions[0],
        variableChecker
      )
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: validationResult.info.value,
        },
      }
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

  if (node.type === 'VECTOR_ITEM_SWIZZLE_EXTRACTION') {
    const vectorInfo = predictNodeValueType(node.vector, variableChecker)
    if (vectorInfo.status === 'FAIL') {
      return vectorInfo
    }
    if (vectorInfo.info.value !== 'VECTOR') {
      return {
        status: 'FAIL',
        error: 'Vector item swizzle extraction can only be used on a vector',
        problemNode: node,
      }
    }
    if (node.items.length === 1) {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'NUMBER',
        },
      }
    } else {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'VECTOR',
        },
      }
    }
  }

  if (node.type === 'VECTOR_ITEM_INDEX_EXTRACTION') {
    const vectorInfo = predictNodeValueType(node.vector, variableChecker)
    if (vectorInfo.status === 'FAIL') {
      return vectorInfo
    }
    if (vectorInfo.info.value !== 'VECTOR') {
      return {
        status: 'FAIL',
        error: 'Vector item index extraction can only be used on a vector',
        problemNode: node,
      }
    }

    for (const item of node.items) {
      const validationResult = predictNodeValueType(item, variableChecker)
      if (validationResult.status === 'FAIL') {
        return validationResult
      }
      if (validationResult.info.value !== 'NUMBER') {
        return {
          status: 'FAIL',
          error: 'Vector item index extraction index must be a number',
          problemNode: item,
        }
      }
    }

    if (node.items.length === 1) {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'NUMBER',
        },
      }
    } else {
      return {
        status: 'SUCCESS',
        info: {
          node: node,
          value: 'VECTOR',
        },
      }
    }
  }

  return {
    status: 'FAIL',
    error: 'Unknown node type',
    problemNode: node,
  }
}
