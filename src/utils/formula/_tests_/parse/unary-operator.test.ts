import { parse } from '../../parse'
describe('parse unary operator', () => {
  test('minus number', () => {
    const result = parse('-3')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'MINUS_PREFIX_UNARY',
        input: {
          id: expect.any(String),
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
        id: expect.any(String),
        type: 'MINUS_PREFIX_UNARY',
        input: {
          id: expect.any(String),
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
        id: expect.any(String),
        type: 'MINUS_PREFIX_UNARY',
        input: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'MINUS_PREFIX_UNARY',
              input: {
                id: expect.any(String),
                type: 'NUMBER',
                value: 3.3,
                text: '3.3',
              },
            },
            {
              id: expect.any(String),
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
