import { parse } from './index'

describe('Expression Parser', () => {
  describe('Number Expressions', () => {
    it('should parse simple numbers', () => {
      const result = parse('42')
      expect(result).toEqual({ type: 'NUMBER', value: 42, text: '42' })
    })

    it('should parse decimal numbers', () => {
      const result = parse('3.14')
      expect(result).toEqual({ type: 'NUMBER', value: 3.14, text: '3.14' })
    })

    it('should parse negative numbers', () => {
      const result = parse('-5')
      expect(result).toEqual({
        type: 'MINUS_PREFIX_UNARY',
        input: { type: 'NUMBER', value: 5, text: '5' },
      })
    })
  })

  describe('Vector Expressions', () => {
    it('should parse empty vector', () => {
      const result = parse('[]')
      expect(result).toEqual({ type: 'VECTOR', items: [] })
    })

    it('should parse vector with single number', () => {
      const result = parse('[1]')
      expect(result).toEqual({
        type: 'VECTOR',
        items: [{ type: 'NUMBER', value: 1, text: '1' }],
      })
    })

    it('should parse vector with multiple numbers', () => {
      const result = parse('[1, 2, 3]')
      expect(result).toEqual({
        type: 'VECTOR',
        items: [
          { type: 'NUMBER', value: 1, text: '1' },
          { type: 'NUMBER', value: 2, text: '2' },
          { type: 'NUMBER', value: 3, text: '3' },
        ],
      })
    })

    it('should parse vector with expressions', () => {
      const result = parse('[1 + 2, 3 * 4]')
      expect(result).toEqual({
        type: 'VECTOR',
        items: [
          {
            type: 'ADD_BINARY',
            inputs: [
              { type: 'NUMBER', value: 1, text: '1' },
              { type: 'NUMBER', value: 2, text: '2' },
            ],
          },
          {
            type: 'MUL_BINARY',
            inputs: [
              { type: 'NUMBER', value: 3, text: '3' },
              { type: 'NUMBER', value: 4, text: '4' },
            ],
          },
        ],
      })
    })
  })

  describe('Parentheses Expressions', () => {
    it('should parse simple parentheses', () => {
      const result = parse('(1 + 2)')
      expect(result).toEqual({
        type: 'PARENTHESES_EXPRESSION',
        expression: {
          type: 'ADD_BINARY',
          inputs: [
            { type: 'NUMBER', value: 1, text: '1' },
            { type: 'NUMBER', value: 2, text: '2' },
          ],
        },
      })
    })

    it('should parse nested parentheses', () => {
      const result = parse('((1 + 2) * 3)')
      expect(result).toEqual({
        type: 'PARENTHESES_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: {
                type: 'ADD_BINARY',
                inputs: [
                  { type: 'NUMBER', value: 1, text: '1' },
                  { type: 'NUMBER', value: 2, text: '2' },
                ],
              },
            },
            { type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse parentheses affecting precedence', () => {
      const result = parse('(1 + 2) * 3')
      expect(result).toEqual({
        type: 'MUL_BINARY',
        inputs: [
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: {
              type: 'ADD_BINARY',
              inputs: [
                { type: 'NUMBER', value: 1, text: '1' },
                { type: 'NUMBER', value: 2, text: '2' },
              ],
            },
          },
          { type: 'NUMBER', value: 3, text: '3' },
        ],
      })
    })
  })

  describe('Complex Expressions', () => {
    it('should parse vector with complex expressions', () => {
      const result = parse('[1 + 2 * 3, (4 + 5) * 6]')
      expect(result).toEqual({
        type: 'VECTOR',
        items: [
          {
            type: 'ADD_BINARY',
            inputs: [
              { type: 'NUMBER', value: 1, text: '1' },
              {
                type: 'MUL_BINARY',
                inputs: [
                  { type: 'NUMBER', value: 2, text: '2' },
                  { type: 'NUMBER', value: 3, text: '3' },
                ],
              },
            ],
          },
          {
            type: 'MUL_BINARY',
            inputs: [
              {
                type: 'PARENTHESES_EXPRESSION',
                expression: {
                  type: 'ADD_BINARY',
                  inputs: [
                    { type: 'NUMBER', value: 4, text: '4' },
                    { type: 'NUMBER', value: 5, text: '5' },
                  ],
                },
              },
              { type: 'NUMBER', value: 6, text: '6' },
            ],
          },
        ],
      })
    })
  })

  describe('Shorthand Multiplication', () => {
    it('should parse number multiplied with function', () => {
      const result = parse('2sin(2)')
      expect(result).toEqual({
        type: 'IMP_MUL',
        inputs: [
          { type: 'NUMBER', value: 2, text: '2' },
          {
            type: 'VARIABLE',
            name: 'sin',
          },
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: { type: 'NUMBER', value: 2, text: '2' },
          },
        ],
      })
    })

    it('should parse number multiplied with vector and number', () => {
      const result = parse('4[1,2]3')
      expect(result).toEqual({
        type: 'IMP_MUL',
        inputs: [
          { type: 'NUMBER', value: 4, text: '4' },
          {
            type: 'VECTOR',
            items: [
              { type: 'NUMBER', value: 1, text: '1' },
              { type: 'NUMBER', value: 2, text: '2' },
            ],
          },
          { type: 'NUMBER', value: 3, text: '3' },
        ],
      })
    })

    it('should parse vector multiplied with function and number', () => {
      const result = parse('sin(12)[1,2]3')
      expect(result).toEqual({
        type: 'IMP_MUL',
        inputs: [
          {
            type: 'VARIABLE',
            name: 'sin',
          },
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: { type: 'NUMBER', value: 12, text: '12' },
          },
          {
            type: 'VECTOR',
            items: [
              { type: 'NUMBER', value: 1, text: '1' },
              { type: 'NUMBER', value: 2, text: '2' },
            ],
          },
          { type: 'NUMBER', value: 3, text: '3' },
        ],
      })
    })

    it('should parse chained shorthand multiplication', () => {
      const result = parse('2sin(30)cos(60)')
      expect(result).toEqual({
        type: 'IMP_MUL',
        inputs: [
          { type: 'NUMBER', value: 2, text: '2' },
          {
            type: 'VARIABLE',
            name: 'sin',
          },
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: { type: 'NUMBER', value: 30, text: '30' },
          },
          {
            type: 'VARIABLE',
            name: 'cos',
          },
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: { type: 'NUMBER', value: 60, text: '60' },
          },
        ],
      })
    })

    it('should parse chained shorthand multiplication with unary operator', () => {
      const result = parse('-2sin(30)cos(60)')
      expect(result).toEqual({
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'IMP_MUL',
          inputs: [
            { type: 'NUMBER', value: 2, text: '2' },
            {
              type: 'VARIABLE',
              name: 'sin',
            },
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: { type: 'NUMBER', value: 30, text: '30' },
            },
            {
              type: 'VARIABLE',
              name: 'cos',
            },
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: { type: 'NUMBER', value: 60, text: '60' },
            },
          ],
        },
      })
    })

    it('should parse shorthand multiplication with parentheses', () => {
      const result = parse('(3+4)(5+6)3.3')
      console.log('DEBUG:', JSON.stringify(result, null, 2))

      expect(result).toEqual({
        type: 'IMP_MUL',
        inputs: [
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: {
              type: 'ADD_BINARY',
              inputs: [
                {
                  type: 'NUMBER',
                  value: 3,
                  text: '3',
                },
                {
                  type: 'NUMBER',
                  value: 4,
                  text: '4',
                },
              ],
            },
          },
          {
            type: 'PARENTHESES_EXPRESSION',
            expression: {
              type: 'ADD_BINARY',
              inputs: [
                {
                  type: 'NUMBER',
                  value: 5,
                  text: '5',
                },
                {
                  type: 'NUMBER',
                  value: 6,
                  text: '6',
                },
              ],
            },
          },
          {
            type: 'NUMBER',
            value: 3.3,
            text: '3.3',
          },
        ],
      })
    })

    it('should parse shorthand multiplication with parentheses and unary operator', () => {
      const result = parse('-(3+4)(5+6)3.3')
      expect(result).toEqual({
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'IMP_MUL',
          inputs: [
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: {
                type: 'ADD_BINARY',
                inputs: [
                  {
                    type: 'NUMBER',
                    value: 3,
                    text: '3',
                  },
                  {
                    type: 'NUMBER',
                    value: 4,
                    text: '4',
                  },
                ],
              },
            },
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: {
                type: 'ADD_BINARY',
                inputs: [
                  {
                    type: 'NUMBER',
                    value: 5,
                    text: '5',
                  },
                  {
                    type: 'NUMBER',
                    value: 6,
                    text: '6',
                  },
                ],
              },
            },
            {
              type: 'NUMBER',
              value: 3.3,
              text: '3.3',
            },
          ],
        },
      })
    })
  })
})
