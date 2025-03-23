import { parse } from '../../parse'
describe('parse vector', () => {
  test('empty vector', () => {
    const result = parse('[]')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
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
        id: expect.any(String),
        type: 'VECTOR',
        items: [
          {
            id: expect.any(String),
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
        id: expect.any(String),
        type: 'VECTOR',
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 3,
            text: '3',
          },
          {
            id: expect.any(String),
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
        id: expect.any(String),
        type: 'VECTOR',
        items: [
          {
            id: expect.any(String),
            type: 'MINUS_PREFIX_UNARY',
            input: {
              id: expect.any(String),
              type: 'NUMBER',
              value: 3,
              text: '3',
            },
          },
          {
            id: expect.any(String),
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
