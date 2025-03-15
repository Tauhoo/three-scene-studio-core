import { parse } from './index'

describe('parse number term', () => {
  test('multiple 2 number', () => {
    const result = parse('123.45 * 67.89')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'MUL_BINARY',
        inputs: [
          {
            type: 'NUMBER',
            value: 123.45,
          },
          {
            type: 'NUMBER',
            value: 67.89,
          },
        ],
      },
    }
    expect(result).toEqual(expected)
  })

  test('multiple 3 number', () => {
    const result = parse('123.45 * 67.89 * 100')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'MUL_BINARY',
        inputs: [
          {
            type: 'MUL_BINARY',
            inputs: [
              {
                type: 'NUMBER',
                value: 123.45,
              },
              {
                type: 'NUMBER',
                value: 67.89,
              },
            ],
          },
          {
            type: 'NUMBER',
            value: 100,
          },
        ],
      },
    }
    expect(result).toEqual(expected)
  })
})
