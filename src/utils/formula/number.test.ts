import { parse } from './index'
describe('parse number', () => {
  test('integer', () => {
    const result = parse('3')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'NUMBER',
        value: 3,
      },
    }

    expect(result).toEqual(expected)
  })

  test('long integer', () => {
    const result = parse('12638')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'NUMBER',
        value: 12638,
      },
    }
    expect(result).toEqual(expected)
  })

  test('decimal', () => {
    const result = parse('3.3')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'NUMBER',
        value: 3.3,
      },
    }
    expect(result).toEqual(expected)
  })

  test('long decimal', () => {
    const result = parse('123.142730')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'NUMBER',
        value: 123.14273,
      },
    }
    expect(result).toEqual(expected)
  })

  test('start with 0', () => {
    const result = parse('0.123')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: { type: 'NUMBER', value: 0.123 },
    }
    expect(result).toEqual(expected)
  })

  test('start with 0 and long integer part', () => {
    const result = parse('023.123')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: { type: 'NUMBER', value: 23.123 },
    }
    expect(result).toEqual(expected)
  })

  test('end with 0', () => {
    const result = parse('123.00')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: { type: 'NUMBER', value: 123 },
    }
    expect(result).toEqual(expected)
  })

  test('start with 0 and long decimal part and end with 0', () => {
    const result = parse('23.4500')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: { type: 'NUMBER', value: 23.45 },
    }
    expect(result).toEqual(expected)
  })
})
