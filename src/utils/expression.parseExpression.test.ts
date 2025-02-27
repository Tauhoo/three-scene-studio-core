import { parseExpression } from './expression'

describe('parseExpression', () => {
  it('empty expression', () => {
    const result = parseExpression('')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_EXPRESSION',
      error: 'Empty expression',
    })
  })

  it('no symbol expression', () => {
    const expression = '123 + 1'
    const result = parseExpression(expression)
    const expected = {
      status: 'SUCCESS',
      data: {
        expression,
        variables: [],
        blocks: [
          { type: 'expression', value: expression, id: expect.any(String) },
        ],
      },
    }
    expect(result).toMatchObject(expected)
  })

  it('simple expression', () => {
    const expression = 'a + b'
    const result = parseExpression(expression)
    const expected = {
      status: 'SUCCESS',
      data: {
        expression,
        variables: ['a', 'b'],
        blocks: [
          { type: 'variable', value: 'a', id: expect.any(String) },
          { type: 'expression', value: ' + ', id: expect.any(String) },
          { type: 'variable', value: 'b', id: expect.any(String) },
        ],
      },
    }
    expect(result).toMatchObject(expected)
  })

  it('expression with function', () => {
    const expression = 'a + sin(b)'
    const result = parseExpression(expression)
    const expected = {
      status: 'SUCCESS',
      data: {
        expression,
        variables: ['a', 'b'],
        blocks: [
          { type: 'variable', value: 'a', id: expect.any(String) },
          { type: 'expression', value: ' + ', id: expect.any(String) },
          { type: 'function', value: 'sin', id: expect.any(String) },
          { type: 'expression', value: '(', id: expect.any(String) },
          { type: 'variable', value: 'b', id: expect.any(String) },
          { type: 'expression', value: ')', id: expect.any(String) },
        ],
      },
    }
    expect(result).toMatchObject(expected)
  })
})
