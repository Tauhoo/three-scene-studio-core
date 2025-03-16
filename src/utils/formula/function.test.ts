import { parse } from './index'

describe('Function Parser', () => {
  describe('Number Functions', () => {
    it('should parse sin function', () => {
      const result = parse('sin(45)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'SIN_FUNCTION',
          input: { type: 'NUMBER', value: 45 },
        },
      })
    })

    it('should parse cos function', () => {
      const result = parse('cos(3.14)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'COS_FUNCTION',
          input: { type: 'NUMBER', value: 3.14 },
        },
      })
    })

    it('should parse tan function', () => {
      const result = parse('tan(30)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'TAN_FUNCTION',
          input: { type: 'NUMBER', value: 30 },
        },
      })
    })

    it('should parse atan function', () => {
      const result = parse('atan(1)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ATAN_FUNCTION',
          input: { type: 'NUMBER', value: 1 },
        },
      })
    })

    it('should parse abs function', () => {
      const result = parse('abs(-5)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ABS_FUNCTION',
          input: {
            type: 'MINUS_PREFIX_UNARY',
            input: { type: 'NUMBER', value: 5 },
          },
        },
      })
    })

    it('should parse nested number functions', () => {
      const result = parse('sin(cos(30))')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'SIN_FUNCTION',
          input: {
            type: 'COS_FUNCTION',
            input: { type: 'NUMBER', value: 30 },
          },
        },
      })
    })

    it('should parse function with expression argument', () => {
      const result = parse('sin(45 + 45)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'SIN_FUNCTION',
          input: {
            type: 'ADD_BINARY',
            inputs: [
              { type: 'NUMBER', value: 45 },
              { type: 'NUMBER', value: 45 },
            ],
          },
        },
      })
    })
  })

  describe('Vector Functions', () => {
    it('should parse dot function', () => {
      const result = parse('dot([1,0,0], [0,1,0])')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'DOT_FUNCTION',
          inputs: [
            {
              type: 'VECTOR',
              items: [
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 0 },
                { type: 'NUMBER', value: 0 },
              ],
            },
            {
              type: 'VECTOR',
              items: [
                { type: 'NUMBER', value: 0 },
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 0 },
              ],
            },
          ],
        },
      })
    })

    it('should parse cross function', () => {
      const result = parse('cross([1,0,0], [0,1,0])')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'CROSS_FUNCTION',
          inputs: [
            {
              type: 'VECTOR',
              items: [
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 0 },
                { type: 'NUMBER', value: 0 },
              ],
            },
            {
              type: 'VECTOR',
              items: [
                { type: 'NUMBER', value: 0 },
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 0 },
              ],
            },
          ],
        },
      })
    })

    it('should parse normalize function', () => {
      const result = parse('normalize([1,1,1])')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'NORMALIZE_FUNCTION',
          input: {
            type: 'VECTOR',
            items: [
              { type: 'NUMBER', value: 1 },
              { type: 'NUMBER', value: 1 },
              { type: 'NUMBER', value: 1 },
            ],
          },
        },
      })
    })

    it('should parse vector function with expressions', () => {
      const result = parse('dot([1+1, 2*2, 3], [4, 5, 6])')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'DOT_FUNCTION',
          inputs: [
            {
              type: 'VECTOR',
              items: [
                {
                  type: 'ADD_BINARY',
                  inputs: [
                    { type: 'NUMBER', value: 1 },
                    { type: 'NUMBER', value: 1 },
                  ],
                },
                {
                  type: 'MUL_BINARY',
                  inputs: [
                    { type: 'NUMBER', value: 2 },
                    { type: 'NUMBER', value: 2 },
                  ],
                },
                { type: 'NUMBER', value: 3 },
              ],
            },
            {
              type: 'VECTOR',
              items: [
                { type: 'NUMBER', value: 4 },
                { type: 'NUMBER', value: 5 },
                { type: 'NUMBER', value: 6 },
              ],
            },
          ],
        },
      })
    })
  })

  describe('Complex Function Combinations', () => {
    it('should parse function in binary operations', () => {
      const result = parse('sin(30) + cos(60)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ADD_BINARY',
          inputs: [
            {
              type: 'SIN_FUNCTION',
              input: { type: 'NUMBER', value: 30 },
            },
            {
              type: 'COS_FUNCTION',
              input: { type: 'NUMBER', value: 60 },
            },
          ],
        },
      })
    })

    it('should parse nested vector functions', () => {
      const result = parse('normalize(cross([1,0,0], [0,1,0]))')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'NORMALIZE_FUNCTION',
          input: {
            type: 'CROSS_FUNCTION',
            inputs: [
              {
                type: 'VECTOR',
                items: [
                  { type: 'NUMBER', value: 1 },
                  { type: 'NUMBER', value: 0 },
                  { type: 'NUMBER', value: 0 },
                ],
              },
              {
                type: 'VECTOR',
                items: [
                  { type: 'NUMBER', value: 0 },
                  { type: 'NUMBER', value: 1 },
                  { type: 'NUMBER', value: 0 },
                ],
              },
            ],
          },
        },
      })
    })

    it('should parse mixed function types', () => {
      const result = parse('dot(normalize([1,1,1]), [cos(0), sin(90), 0])')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'DOT_FUNCTION',
          inputs: [
            {
              type: 'NORMALIZE_FUNCTION',
              input: {
                type: 'VECTOR',
                items: [
                  { type: 'NUMBER', value: 1 },
                  { type: 'NUMBER', value: 1 },
                  { type: 'NUMBER', value: 1 },
                ],
              },
            },
            {
              type: 'VECTOR',
              items: [
                {
                  type: 'COS_FUNCTION',
                  input: { type: 'NUMBER', value: 0 },
                },
                {
                  type: 'SIN_FUNCTION',
                  input: { type: 'NUMBER', value: 90 },
                },
                { type: 'NUMBER', value: 0 },
              ],
            },
          ],
        },
      })
    })
  })

  describe('Shorthand Multiplication', () => {
    it('should parse number multiplied with function', () => {
      const result = parse('2sin(2)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            { type: 'NUMBER', value: 2 },
            {
              type: 'SIN_FUNCTION',
              input: { type: 'NUMBER', value: 2 },
            },
          ],
        },
      })
    })

    it('should parse number multiplied with vector and number', () => {
      const result = parse('4[1,2]3')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'MUL_BINARY',
              inputs: [
                { type: 'NUMBER', value: 4 },
                {
                  type: 'VECTOR',
                  items: [
                    { type: 'NUMBER', value: 1 },
                    { type: 'NUMBER', value: 2 },
                  ],
                },
              ],
            },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })

    it('should parse vector multiplied with function and number', () => {
      const result = parse('sin(12)[1,2]3')
      expect(result).toEqual({
        type: 'VECTOR_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'MUL_BINARY',
              inputs: [
                {
                  type: 'SIN_FUNCTION',
                  input: { type: 'NUMBER', value: 12 },
                },
                {
                  type: 'VECTOR',
                  items: [
                    { type: 'NUMBER', value: 1 },
                    { type: 'NUMBER', value: 2 },
                  ],
                },
              ],
            },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })

    it('should parse chained shorthand multiplication', () => {
      const result = parse('2sin(30)cos(60)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'MUL_BINARY',
              inputs: [
                { type: 'NUMBER', value: 2 },
                {
                  type: 'SIN_FUNCTION',
                  input: { type: 'NUMBER', value: 30 },
                },
              ],
            },
            {
              type: 'COS_FUNCTION',
              input: { type: 'NUMBER', value: 60 },
            },
          ],
        },
      })
    })

    it('should parse chained shorthand multiplication with unary operator', () => {
      const result = parse('-2sin(30)cos(60)')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MINUS_PREFIX_UNARY',
          input: {
            type: 'MUL_BINARY',
            inputs: [
              {
                type: 'MUL_BINARY',
                inputs: [
                  { type: 'NUMBER', value: 2 },
                  {
                    type: 'SIN_FUNCTION',
                    input: { type: 'NUMBER', value: 30 },
                  },
                ],
              },
              {
                type: 'COS_FUNCTION',
                input: { type: 'NUMBER', value: 60 },
              },
            ],
          },
        },
      })
    })

    it('should parse shorthand multiplication with parentheses', () => {
      const result = parse('(3+4)(5+6)3.3')
      console.log('DEBUG:', JSON.stringify(result, null, 2))

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
                  {
                    type: 'NUMBER',
                    value: 3,
                  },
                  {
                    type: 'NUMBER',
                    value: 4,
                  },
                ],
              },
            },
            {
              type: 'MUL_BINARY',
              inputs: [
                {
                  type: 'PARENTHESES_EXPRESSION',
                  expression: {
                    type: 'ADD_BINARY',
                    inputs: [
                      {
                        type: 'NUMBER',
                        value: 5,
                      },
                      {
                        type: 'NUMBER',
                        value: 6,
                      },
                    ],
                  },
                },
                {
                  type: 'NUMBER',
                  value: 3.3,
                },
              ],
            },
          ],
        },
      })
    })

    it('should parse shorthand multiplication with parentheses and unary operator', () => {
      const result = parse('-(3+4)(5+6)3.3')
      console.log('DEBUG:', JSON.stringify(result, null, 2))

      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MINUS_PREFIX_UNARY',
          input: {
            type: 'MUL_BINARY',
            inputs: [
              {
                type: 'PARENTHESES_EXPRESSION',
                expression: {
                  type: 'ADD_BINARY',
                  inputs: [
                    {
                      type: 'NUMBER',
                      value: 3,
                    },
                    {
                      type: 'NUMBER',
                      value: 4,
                    },
                  ],
                },
              },
              {
                type: 'MUL_BINARY',
                inputs: [
                  {
                    type: 'PARENTHESES_EXPRESSION',
                    expression: {
                      type: 'ADD_BINARY',
                      inputs: [
                        {
                          type: 'NUMBER',
                          value: 5,
                        },
                        {
                          type: 'NUMBER',
                          value: 6,
                        },
                      ],
                    },
                  },
                  {
                    type: 'NUMBER',
                    value: 3.3,
                  },
                ],
              },
            ],
          },
        },
      })
    })
  })
})
