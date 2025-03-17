import { parse } from './index'
describe('parse unary operator', () => {
  test('minus number', () => {
    const result = parse('-3')
    const expected = {
      type: 'MINUS_PREFIX_UNARY',
      input: {
        type: 'NUMBER',
        value: 3,
      },
    }
    expect(result).toEqual(expected)
  })

  test('minus number with decimal', () => {
    const result = parse('-3.3')
    const expected = {
      type: 'MINUS_PREFIX_UNARY',
      input: {
        type: 'NUMBER',
        value: 3.3,
      },
    }
    expect(result).toEqual(expected)
  })

  test('minus vector', () => {
    const result = parse('-[-3.3, 4.5]')
    const expected = {
      type: 'MINUS_PREFIX_UNARY',
      input: {
        type: 'VECTOR',
        items: [
          {
            type: 'MINUS_PREFIX_UNARY',
            input: { type: 'NUMBER', value: 3.3 },
          },
          { type: 'NUMBER', value: 4.5 },
        ],
      },
    }
    expect(result).toEqual(expected)
  })
})
