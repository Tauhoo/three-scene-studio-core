import { parse } from '../../parse'
describe('parse vector', () => {
  test('empty vector', () => {
    const result = parse('[]')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'VECTOR',
        items: [],
      },
    }

    expect(result).toEqual(expected)
  })

  test('one number', () => {
    const result = parse('[3]')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'VECTOR',
        items: [
          {
            type: 'NUMBER',
            value: 3,
            text: '3',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('two numbers', () => {
    const result = parse('[3, 4]')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'VECTOR',
        items: [
          {
            type: 'NUMBER',
            value: 3,
            text: '3',
          },
          {
            type: 'NUMBER',
            value: 4,
            text: '4',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('contain unary operator numbers', () => {
    const result = parse('[-3, 4]')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'VECTOR',
        items: [
          {
            type: 'MINUS_PREFIX_UNARY',
            input: {
              type: 'NUMBER',
              value: 3,
              text: '3',
            },
          },
          {
            type: 'NUMBER',
            value: 4,
            text: '4',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })
})
