import { getBlocks } from '../../block'
import { parse } from '../../parse'

describe('getBlocks', () => {
  it('Expression only', () => {
    const formulaText = '1 + 2'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocks(formulaText, parseResult.data)
    expect(result).toEqual({
      status: 'SUCCESS',
      data: [{ id: expect.any(String), type: 'EXPRESSION', text: '1 + 2' }],
    })
  })

  it('Expression with function', () => {
    const formulaText = 'x + cos(1)'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocks(formulaText, parseResult.data)
    expect(result).toEqual({
      status: 'SUCCESS',
      data: [
        { id: expect.any(String), type: 'VARIABLE', name: 'x' },
        { id: expect.any(String), type: 'EXPRESSION', text: ' + ' },
        { id: expect.any(String), type: 'FUNCTION', func: 'cos' },
        { id: expect.any(String), type: 'EXPRESSION', text: '(1)' },
      ],
    })
  })

  it('Expression with vector', () => {
    const formulaText = '2 + [1, 2, 3]'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocks(formulaText, parseResult.data)
    expect(result).toEqual({
      status: 'SUCCESS',
      data: [
        { id: expect.any(String), type: 'EXPRESSION', text: '2 + [1, 2, 3]' },
      ],
    })
  })

  it('Vector with function inside', () => {
    const formulaText = '[1, 2, cos(10)]'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocks(formulaText, parseResult.data)
    expect(result).toEqual({
      status: 'SUCCESS',
      data: [
        { id: expect.any(String), type: 'EXPRESSION', text: '[1, 2, ' },
        { id: expect.any(String), type: 'FUNCTION', func: 'cos' },
        { id: expect.any(String), type: 'EXPRESSION', text: '(10)]' },
      ],
    })
  })

  it('Function with expression inside', () => {
    const formulaText = 'cos(1 + 2 + sin(30))'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocks(formulaText, parseResult.data)
    expect(result).toEqual({
      status: 'SUCCESS',
      data: [
        { id: expect.any(String), type: 'FUNCTION', func: 'cos' },
        { id: expect.any(String), type: 'EXPRESSION', text: '(1 + 2 + ' },
        { id: expect.any(String), type: 'FUNCTION', func: 'sin' },
        { id: expect.any(String), type: 'EXPRESSION', text: '(30))' },
      ],
    })
  })
})
