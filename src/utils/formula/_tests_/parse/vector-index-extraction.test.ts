import { parse } from '../../parse'
describe('parse vector item index extraction', () => {
  test('vector with one extraction', () => {
    const result = parse('[0, 1]{0}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 0,
              text: '0',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 1,
              text: '1',
            },
          ],
        },
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 0,
            text: '0',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('vector with one extraction with complex expression as index', () => {
    const result = parse('[0, 1]{2+3}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 0,
              text: '0',
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 1,
              text: '1',
            },
          ],
        },
        items: [
          {
            id: expect.any(String),
            type: 'ADD',
            inputs: [
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
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('vector with two extractions', () => {
    const result = parse('[2, 3]{0, 1}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
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
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 0,
            text: '0',
          },
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 1,
            text: '1',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('variable with two extraction', () => {
    const result = parse('j{8}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VARIABLE',
          name: 'j',
        },
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 8,
            text: '8',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('variable with two extraction', () => {
    const result = parse('x{0, 1}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'VARIABLE',
          name: 'x',
        },
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 0,
            text: '0',
          },
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 1,
            text: '1',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })

  test('parenthesis with one extraction', () => {
    const result = parse('([1,2,3]+2){3}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                {
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
                {
                  id: expect.any(String),
                  type: 'NUMBER',
                  value: 2,
                  text: '2',
                },
              ],
            },
          ],
        },
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

  test('parenthesis with two extractions', () => {
    const result = parse('([1,2,3]+2){0, 1}')
    const expected = {
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'VECTOR_ITEM_INDEX_EXTRACTION',
        vector: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                {
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
                {
                  id: expect.any(String),
                  type: 'NUMBER',
                  value: 2,
                  text: '2',
                },
              ],
            },
          ],
        },
        items: [
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 0,
            text: '0',
          },
          {
            id: expect.any(String),
            type: 'NUMBER',
            value: 1,
            text: '1',
          },
        ],
      },
    }

    expect(result).toEqual(expected)
  })
})
