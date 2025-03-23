import { parse } from '../../parse'

describe('function test', () => {
  it('start with function', () => {
    const result = parse('sin(12)[1,2]3')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'IMP_MUL',
        inputs: [
          {
            id: expect.any(String),
            type: 'FUNCTION',
            func: 'sin',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', value: 12, text: '12' },
            ],
          },
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

  it('chained function', () => {
    const result = parse('2sin(30)cos(60)')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'IMP_MUL',
        inputs: [
          { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          {
            id: expect.any(String),
            type: 'FUNCTION',
            func: 'sin',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', value: 30, text: '30' },
            ],
          },
          {
            id: expect.any(String),
            type: 'FUNCTION',
            func: 'cos',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', value: 60, text: '60' },
            ],
          },
        ],
      },
    })
  })

  it('chained function with unary operator', () => {
    const result = parse('-2sin(30)cos(60)')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'MINUS_PREFIX_UNARY',
        input: {
          id: expect.any(String),
          type: 'IMP_MUL',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            {
              id: expect.any(String),
              type: 'FUNCTION',
              func: 'sin',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'NUMBER',
                  value: 30,
                  text: '30',
                },
              ],
            },
            {
              id: expect.any(String),
              type: 'FUNCTION',
              func: 'cos',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'NUMBER',
                  value: 60,
                  text: '60',
                },
              ],
            },
          ],
        },
      },
    })
  })

  it('should parse number multiplied with function', () => {
    const result = parse('2sin(2)')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'IMP_MUL',
        inputs: [
          { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          {
            id: expect.any(String),
            type: 'FUNCTION',
            func: 'sin',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            ],
          },
        ],
      },
    })
  })

  it('function with out parentheses', () => {
    const result = parse('2sin')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error: 'Can not use sin function without arguments',
    })
  })

  it('function with out parentheses in vector', () => {
    const result = parse('[2sin, 0]')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error: 'Can not use sin function without arguments',
    })
  })

  it('function with out parentheses with vector', () => {
    const result = parse('2sin[1,2]')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error: 'Can not use sin function without arguments',
    })
  })

  it('empty parentheses', () => {
    const result = parse('2()')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error: 'A parentheses expression is empty',
    })
  })

  it('mismatch arguments', () => {
    const result = parse('2sin(1,2)')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'IMP_MUL',
        inputs: [
          { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          {
            id: expect.any(String),
            type: 'FUNCTION',
            func: 'sin',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
              { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            ],
          },
        ],
      },
    })
  })

  it('multiple expressions in parentheses', () => {
    const result = parse('2(1+2,19)3')
    expect(result).toEqual({
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error:
        'Multiple expressions in parentheses can be used for function invocation only',
    })
  })

  it('function with nested expressions', () => {
    const result = parse('cos(1 + 2 + sin(30))')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        id: expect.any(String),
        type: 'FUNCTION',
        func: 'cos',
        inputs: [
          {
            id: expect.any(String),
            type: 'ADD',
            inputs: [
              { id: expect.any(String), type: 'NUMBER', text: '1', value: 1 },
              { id: expect.any(String), type: 'NUMBER', text: '2', value: 2 },
              {
                id: expect.any(String),
                type: 'FUNCTION',
                func: 'sin',
                inputs: [
                  {
                    id: expect.any(String),
                    type: 'NUMBER',
                    text: '30',
                    value: 30,
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  })
})
