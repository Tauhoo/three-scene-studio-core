import { parse } from './index'

describe('Expression Parser', () => {
  describe('Number Expressions', () => {
    it('should parse simple numbers', () => {
      const result = parse('42')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: { type: 'NUMBER', value: 42 },
      })
    })

    it('should parse decimal numbers', () => {
      const result = parse('3.14')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: { type: 'NUMBER', value: 3.14 },
      })
    })

    it('should parse negative numbers', () => {
      const result = parse('-5')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MINUS_PREFIX_UNARY',
          input: { type: 'NUMBER', value: 5 },
        },
      })
    })
  })

  describe('Vector Expressions', () => {
    it('should parse empty vector', () => {
      const result = parse('[]')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: { type: 'VECTOR', items: [] },
      })
    })

    it('should parse vector with single number', () => {
      const result = parse('[1]')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'VECTOR',
          items: [{ type: 'NUMBER', value: 1 }],
        },
      })
    })

    it('should parse vector with multiple numbers', () => {
      const result = parse('[1, 2, 3]')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'VECTOR',
          items: [
            { type: 'NUMBER', value: 1 },
            { type: 'NUMBER', value: 2 },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })

    it('should parse vector with expressions', () => {
      const result = parse('[1 + 2, 3 * 4]')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'VECTOR',
          items: [
            {
              type: 'ADD_BINARY',
              inputs: [
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 2 },
              ],
            },
            {
              type: 'MUL_BINARY',
              inputs: [
                { type: 'NUMBER', value: 3 },
                { type: 'NUMBER', value: 4 },
              ],
            },
          ],
        },
      })
    })
  })

  describe('Parentheses Expressions', () => {
    it('should parse simple parentheses', () => {
      const result = parse('(1 + 2)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'PARENTHESES_EXPRESSION',
          expression: {
            type: 'ADD_BINARY',
            inputs: [
              { type: 'NUMBER', value: 1 },
              { type: 'NUMBER', value: 2 },
            ],
          },
        },
      })
    })

    it('should parse nested parentheses', () => {
      const result = parse('((1 + 2) * 3)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'PARENTHESES_EXPRESSION',
          expression: {
            type: 'MUL_BINARY',
            inputs: [
              {
                type: 'PARENTHESES_EXPRESSION',
                expression: {
                  type: 'ADD_BINARY',
                  inputs: [
                    { type: 'NUMBER', value: 1 },
                    { type: 'NUMBER', value: 2 },
                  ],
                },
              },
              { type: 'NUMBER', value: 3 },
            ],
          },
        },
      })
    })

    it('should parse parentheses affecting precedence', () => {
      const result = parse('(1 + 2) * 3')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'PARENTHESES_EXPRESSION',
              expression: {
                type: 'ADD_BINARY',
                inputs: [
                  { type: 'NUMBER', value: 1 },
                  { type: 'NUMBER', value: 2 },
                ],
              },
            },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })
  })

  describe('Complex Expressions', () => {
    it('should parse vector with complex expressions', () => {
      const result = parse('[1 + 2 * 3, (4 + 5) * 6]')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'VECTOR',
          items: [
            {
              type: 'ADD_BINARY',
              inputs: [
                { type: 'NUMBER', value: 1 },
                {
                  type: 'MUL_BINARY',
                  inputs: [
                    { type: 'NUMBER', value: 2 },
                    { type: 'NUMBER', value: 3 },
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
                      { type: 'NUMBER', value: 4 },
                      { type: 'NUMBER', value: 5 },
                    ],
                  },
                },
                { type: 'NUMBER', value: 6 },
              ],
            },
          ],
        },
      })
    })
  })
})
