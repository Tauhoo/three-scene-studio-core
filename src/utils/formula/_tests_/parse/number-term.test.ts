import { parse } from '../../parse'

describe('parse number term', () => {
  test('multiple 2 number', () => {
    const result = parse('123.45 * 67.89')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'MUL',
        inputs: [
          {
            type: 'NUMBER',
            value: 123.45,
            text: '123.45',
          },
          {
            type: 'NUMBER',
            value: 67.89,
            text: '67.89',
          },
        ],
      },
    }
    expect(result).toEqual(expected)
  })

  test('multiple 3 number', () => {
    const result = parse('123.45 * 67.89 * 100')
    const expected = {
      status: 'SUCCESS',
      data: {
        type: 'MUL',
        inputs: [
          {
            type: 'NUMBER',
            value: 123.45,
            text: '123.45',
          },
          {
            type: 'NUMBER',
            value: 67.89,
            text: '67.89',
          },
          {
            type: 'NUMBER',
            value: 100,
            text: '100',
          },
        ],
      },
    }
    expect(result).toEqual(expected)
  })
})
