import { parse } from '../../parse'

describe('parse vector swizzle extraction', () => {
  test('vector with one swizzle', () => {
    const result = parse('[1, 2, 3].x')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 1,
              text: '1',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 2,
              text: '2',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 3,
              text: '3',
            },
          ],
        },
        items: ['x'],
      },
    }

    expect(result).toEqual(expected)
  })

  test('vector with two swizzle', () => {
    const result = parse('[1, 2, 3].xw')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 1,
              text: '1',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 2,
              text: '2',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 3,
              text: '3',
            },
          ],
        },
        items: ['x', 'w'],
      },
    }

    expect(result).toEqual(expected)
  })

  test('variable with one swizzle', () => {
    const result = parse('v.x')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VARIABLE',
          name: 'v',
        },
        items: ['x'],
      },
    }

    expect(result).toEqual(expected)
  })

  test('variable with two swizzle', () => {
    const result = parse('v.xy')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VARIABLE',
          name: 'v',
        },
        items: ['x', 'y'],
      },
    }

    expect(result).toEqual(expected)
  })

  test('parentheses expression with one swizzle', () => {
    const result = parse('(v+1).x')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'VARIABLE', name: 'v' },
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
              ],
            },
          ],
        },
        items: ['x'],
      },
    }

    expect(result).toEqual(expected)
  })

  test('parentheses expression with two swizzle', () => {
    const result = parse('(v+1).xy')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_SWIZZLE_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'VARIABLE', name: 'v' },
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
              ],
            },
          ],
        },
        items: ['x', 'y'],
      },
    }

    expect(result).toEqual(expected)
  })
})
