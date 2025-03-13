import { parse } from './index'
describe('parse unary operator', () => {
  test('integer', () => {
    const result = parse('-3.3')
    const expected = {
      type: 'NUMBER_EXPRESSION',
      expression: {
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'NUMBER',
          value: 3.3,
        },
      },
    }
    expect(result).toEqual(expected)
  })
})
