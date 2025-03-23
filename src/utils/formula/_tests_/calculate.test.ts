import { calculate, Parameters } from '../calculate'
import { successResponse, errorResponse } from '../../response'
import { parse } from '../parse' // Assuming there's a parse method in a parser module

describe('calculate', () => {
  it('should calculate a number expression', () => {
    const expression = '5'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(5))
  })

  it('should calculate a variable expression', () => {
    const expression = 'x'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables: Parameters = {
      x: { type: 'NUMBER', name: 'x', value: 10 },
    }
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(10))
  })

  it('should calculate a vector expression', () => {
    const expression = '[1, 2]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([1, 2]))
  })

  it('should calculate a function expression', () => {
    const expression = 'sin(0)'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(Math.sin(0)))
  })

  it('should calculate an addition expression', () => {
    const expression = '1 + 2 + 3'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(6))
  })

  it('should calculate a subtraction expression', () => {
    const expression = '5 - 3 - 2'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(0))
  })

  it('should calculate a multiplication expression', () => {
    const expression = '2 * 3 * 4'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(24))
  })

  it('should calculate a division expression', () => {
    const expression = '6 / 2 / 3'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(1))
  })

  it('should calculate a modulus expression', () => {
    const expression = '5 % 2 % 3'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(1))
  })

  it('should calculate a mix binary expression', () => {
    const expression = '5 % 2 * 3 - 2'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(1))
  })

  it('should calculate an addition vector expression', () => {
    const expression = '[1, 2] + [3, 4]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([4, 6]))
  })

  it('should calculate a subtraction vector expression', () => {
    const expression = '[5, 6] - [3, 2]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([2, 4]))
  })

  it('should calculate a multiplication vector expression', () => {
    const expression = '[2, 3] * [4, 5]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([8, 15]))
  })

  it('should calculate a division vector expression', () => {
    const expression = '[6, 8] / [2, 4]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([3, 2]))
  })

  it('should calculate a modulus vector expression', () => {
    const expression = '[5, 7] % [2, 3]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([1, 1]))
  })

  it('should calculate a mix binary vector expression', () => {
    const expression = '[5, 6] % [2, 3] * [3, 2] - [2, 1]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([1, -1]))
  })

  it('should calculate a vector expression with different lengths', () => {
    const expression = '[1, 2, 3] + [4, 5]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([5, 7, 3]))
  })

  it('should calculate a vector expression with different lengths for multiplication', () => {
    const expression = '[1, 2, 3] * [4, 5]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([4, 10, 0]))
  })

  it('should calculate a vector expression with different lengths for division', () => {
    const expression = '[8, 6, 4] / [2, 3]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([4, 2, Infinity]))
  })

  it('should calculate a vector expression with different lengths for modulus', () => {
    const expression = '[7, 5, 3] % [2, 3]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([1, 2, NaN]))
  })

  it('should calculate a mixed binary vector expression with different lengths', () => {
    const expression = '[1, 2, 3] + [4, 5] * [2, 3] - [1]'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([8, 17, 3]))
  })

  it('should calculate a longer mixed binary expression between number and vector for addition', () => {
    const expression = '5 + [1, 2, 3] + 4'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([10, 11, 12]))
  })

  it('should calculate a longer mixed binary expression between number and vector for subtraction', () => {
    const expression = '10 - [1, 2, 3] - 2'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([7, 6, 5]))
  })

  it('should calculate a longer mixed binary expression between number and vector for multiplication', () => {
    const expression = '2 * [1, 2, 3] * 3'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([6, 12, 18]))
  })

  it('should calculate a longer mixed binary expression between number and vector for division', () => {
    const expression = '12 / [1, 2, 3] / 2'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([6, 3, 2]))
  })

  it('should calculate a longer mixed binary expression between number and vector for modulus', () => {
    const expression = '10 % [2, 3, 4] % 3'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse([0, 1, 2]))
  })

  it('should calculate a minus prefix unary expression', () => {
    const expression = '-5'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(-5))
  })

  it('should calculate a parentheses expression', () => {
    const expression = '(5)'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(successResponse(5))
  })

  it('should return error for unknown node type', () => {
    const expression = 'unknown'
    const node = parse(expression)
    if (node.status === 'ERROR') {
      throw new Error('Failed to parse expression error: ' + node.error)
    }
    const variables = {}
    const result = calculate(node.data, variables)
    expect(result).toEqual(
      errorResponse('VARIABLE_NOT_FOUND', 'Variable unknown not found')
    )
  })
})
