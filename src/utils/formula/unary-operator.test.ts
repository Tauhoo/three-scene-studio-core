import { parse } from './index'
describe('parse unary operator', () => {
  test('minus number', () => {
    const result = parse('-3')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'NUMBER',
          value: 3,
          text: '3',
        },
      },
    }
    expect(result).toEqual(expected)
  })

  test('minus number with decimal', () => {
    const result = parse('-3.3')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'NUMBER',
          value: 3.3,
          text: '3.3',
        },
      },
    }
    expect(result).toEqual(expected)
  })

  test('minus vector', () => {
    const result = parse('-[-3.3, 4.5]')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'VECTOR',
          items: [
            {
              type: 'MINUS_PREFIX_UNARY',
              input: {
                type: 'NUMBER',
                value: 3.3,
                text: '3.3',
              },
            },
            {
              type: 'NUMBER',
              value: 4.5,
              text: '4.5',
            },
          ],
        },
      },
    }
    expect(result).toEqual(expected)
  })
})
