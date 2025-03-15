import { parse } from './index'
describe('parse vector', () => {
  test('empty vector', () => {
    const result = parse('[]')
    const expected = {
      type: 'VECTOR_EXPRESSION',
      expression: {
        type: 'VECTOR',
        items: [],
      },
    }

    expect(result).toEqual(expected)
  })

  test('one number', () => {
    const result = parse('[3]')
    const expected = {
      type: 'VECTOR_EXPRESSION',
      expression: {
        type: 'VECTOR',
        items: [
          {
            type: 'NUMBER',
            value: 3,
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('two numbers', () => {
    const result = parse('[3, 4]')
    const expected = {
      type: 'VECTOR_EXPRESSION',
      expression: {
        type: 'VECTOR',
        items: [
          {
            type: 'NUMBER',
            value: 3,
          },
          {
            type: 'NUMBER',
            value: 4,
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('contain unary operator numbers', () => {
    const result = parse('[-3, 4]')
    const expected = {
      type: 'VECTOR_EXPRESSION',
      expression: {
        type: 'VECTOR',
        items: [
          {
            type: 'MINUS_PREFIX_UNARY',
            input: {
              type: 'NUMBER',
              value: 3,
            },
          },
          {
            type: 'NUMBER',
            value: 4,
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })
})
