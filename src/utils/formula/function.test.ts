import { parse } from './index'

describe('function test', () => {
  it('start with function', () => {
    const result = parse('sin(12)[1,2]3')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        type: 'IMP_MUL',
        inputs: [
          {
            type: 'FUNCTION',
            func: 'sin',
            inputs: [{ type: 'NUMBER', value: 12, text: '12' }],
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
      },
    })
  })

  it('chained function', () => {
    const result = parse('2sin(30)cos(60)')
    expect(result).toEqual({
      status: 'SUCCESS',
      data: {
        type: 'IMP_MUL',
        inputs: [
          { type: 'NUMBER', value: 2, text: '2' },
          {
            type: 'FUNCTION',
            func: 'sin',
            inputs: [{ type: 'NUMBER', value: 30, text: '30' }],
          },
          {
            type: 'FUNCTION',
            func: 'cos',
            inputs: [{ type: 'NUMBER', value: 60, text: '60' }],
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
        type: 'MINUS_PREFIX_UNARY',
        input: {
          type: 'IMP_MUL',
          inputs: [
            { type: 'NUMBER', value: 2, text: '2' },
            {
              type: 'FUNCTION',
              func: 'sin',
              inputs: [{ type: 'NUMBER', value: 30, text: '30' }],
            },
            {
              type: 'FUNCTION',
              func: 'cos',
              inputs: [{ type: 'NUMBER', value: 60, text: '60' }],
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
        type: 'IMP_MUL',
        inputs: [
          { type: 'NUMBER', value: 2, text: '2' },
          {
            type: 'FUNCTION',
            func: 'sin',
            inputs: [{ type: 'NUMBER', value: 2, text: '2' }],
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
      status: 'ERROR',
      code: 'INVALID_FORMULA',
      error: 'Function sin requires 1 arguments, but 2 were provided',
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
})
