import { parse } from '../../parse'

describe('Expression Parser', () => {
  describe('Number Expressions', () => {
    it('should parse simple numbers', () => {
      const result = parse('42')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: { id: expect.any(String), type: 'NUMBER', value: 42, text: '42' },
      })
    })

    it('should parse decimal numbers', () => {
      const result = parse('3.14')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'NUMBER',
          value: 3.14,
          text: '3.14',
        },
      })
    })

    it('should parse negative numbers', () => {
      const result = parse('-5')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MINUS_PREFIX_UNARY',
          input: {
            id: expect.any(String),
            type: 'NUMBER',
            value: 5,
            text: '5',
          },
        },
      })
    })
  })

  describe('Vector Expressions', () => {
    it('should parse empty vector', () => {
      const result = parse('[]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: { id: expect.any(String), type: 'VECTOR', items: [] },
      })
    })

    it('should parse vector with single number', () => {
      const result = parse('[1]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
          ],
        },
      })
    })

    it('should parse vector with multiple numbers', () => {
      const result = parse('[1, 2, 3]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse vector with expressions', () => {
      const result = parse('[1 + 2, 3 * 4]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
                { id: expect.any(String), type: 'NUMBER', value: 4, text: '4' },
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
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
          ],
        },
      })
    })

    it('should parse nested parentheses', () => {
      const result = parse('((1 + 2) * 3)')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'PARENTHESES_EXPRESSION',
          expressions: [
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'PARENTHESES_EXPRESSION',
                  expressions: [
                    {
                      id: expect.any(String),
                      type: 'ADD',
                      inputs: [
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
                      ],
                    },
                  ],
                },
                { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
              ],
            },
          ],
        },
      })
    })

    it('should parse parentheses affecting precedence', () => {
      const result = parse('(1 + 2) * 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MUL',
          inputs: [
            {
              id: expect.any(String),
              type: 'PARENTHESES_EXPRESSION',
              expressions: [
                {
                  id: expect.any(String),
                  type: 'ADD',
                  inputs: [
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
                  ],
                },
              ],
            },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })
  })

  describe('Complex Expressions', () => {
    it('should parse complex vector expressions with multiple consecutive number term operations', () => {
      const result = parse('1 % 4 * [3, 2] - [2, 1]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'MOD',
                  inputs: [
                    {
                      id: expect.any(String),
                      type: 'NUMBER',
                      value: 1,
                      text: '1',
                    },
                    {
                      id: expect.any(String),
                      type: 'NUMBER',
                      value: 4,
                      text: '4',
                    },
                  ],
                },
                {
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
                      value: 2,
                      text: '2',
                    },
                  ],
                },
              ],
            },
            {
              id: expect.any(String),
              type: 'VECTOR',
              items: [
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
              ],
            },
          ],
        },
      })
    })

    it('should parse complex vector expressions with multiple consecutive vector term operations', () => {
      const result = parse('[5, 6] % [2, 3] * [3, 2] - [2, 1]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'MOD',
                  inputs: [
                    {
                      id: expect.any(String),
                      type: 'VECTOR',
                      items: [
                        {
                          id: expect.any(String),
                          type: 'NUMBER',
                          value: 5,
                          text: '5',
                        },
                        {
                          id: expect.any(String),
                          type: 'NUMBER',
                          value: 6,
                          text: '6',
                        },
                      ],
                    },
                    {
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
                  ],
                },
                {
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
                      value: 2,
                      text: '2',
                    },
                  ],
                },
              ],
            },
            {
              id: expect.any(String),
              type: 'VECTOR',
              items: [
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
              ],
            },
          ],
        },
      })
    })

    it('should parse vector with complex expressions', () => {
      const result = parse('[1 + 2 * 3, (4 + 5) * 6]')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'VECTOR',
          items: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
                {
                  id: expect.any(String),
                  type: 'MUL',
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
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'PARENTHESES_EXPRESSION',
                  expressions: [
                    {
                      id: expect.any(String),
                      type: 'ADD',
                      inputs: [
                        {
                          id: expect.any(String),
                          type: 'NUMBER',
                          value: 4,
                          text: '4',
                        },
                        {
                          id: expect.any(String),
                          type: 'NUMBER',
                          value: 5,
                          text: '5',
                        },
                      ],
                    },
                  ],
                },
                { id: expect.any(String), type: 'NUMBER', value: 6, text: '6' },
              ],
            },
          ],
        },
      })
    })
  })

  describe('Shorthand Multiplication', () => {
    it('should parse number multiplied with vector and number', () => {
      const result = parse('4[1,2]3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'IMP_MUL',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 4, text: '4' },
            {
              id: expect.any(String),
              type: 'VECTOR',
              items: [
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse shorthand multiplication with parentheses', () => {
      const result = parse('(3+4)(5+6)3.3')

      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'IMP_MUL',
          inputs: [
            {
              id: expect.any(String),
              type: 'PARENTHESES_EXPRESSION',
              expressions: [
                {
                  id: expect.any(String),
                  type: 'ADD',
                  inputs: [
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
              ],
            },
            {
              id: expect.any(String),
              type: 'PARENTHESES_EXPRESSION',
              expressions: [
                {
                  id: expect.any(String),
                  type: 'ADD',
                  inputs: [
                    {
                      id: expect.any(String),
                      type: 'NUMBER',
                      value: 5,
                      text: '5',
                    },
                    {
                      id: expect.any(String),
                      type: 'NUMBER',
                      value: 6,
                      text: '6',
                    },
                  ],
                },
              ],
            },
            {
              id: expect.any(String),
              type: 'NUMBER',
              value: 3.3,
              text: '3.3',
            },
          ],
        },
      })
    })

    it('should parse shorthand multiplication with parentheses and unary operator', () => {
      const result = parse('-(3+4)(5+6)3.3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MINUS_PREFIX_UNARY',
          input: {
            id: expect.any(String),
            type: 'IMP_MUL',
            inputs: [
              {
                id: expect.any(String),
                type: 'PARENTHESES_EXPRESSION',
                expressions: [
                  {
                    id: expect.any(String),
                    type: 'ADD',
                    inputs: [
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
                ],
              },
              {
                id: expect.any(String),
                type: 'PARENTHESES_EXPRESSION',
                expressions: [
                  {
                    id: expect.any(String),
                    type: 'ADD',
                    inputs: [
                      {
                        id: expect.any(String),
                        type: 'NUMBER',
                        value: 5,
                        text: '5',
                      },
                      {
                        id: expect.any(String),
                        type: 'NUMBER',
                        value: 6,
                        text: '6',
                      },
                    ],
                  },
                ],
              },
              {
                id: expect.any(String),
                type: 'NUMBER',
                value: 3.3,
                text: '3.3',
              },
            ],
          },
        },
      })
    })
  })
})
