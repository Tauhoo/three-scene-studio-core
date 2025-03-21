import { getBlocksFromNode } from '../../block'
import { parse } from '../../parse'

describe('getBlocks', () => {
  it('Expression only', () => {
    const formulaText = '1 + 2'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocksFromNode(parseResult.data)
    expect(result).toEqual([
      { type: 'EXPRESSION', text: '1' },
      { type: 'EXPRESSION', text: '+' },
      { type: 'EXPRESSION', text: '2' },
    ])
  })

  it('Expression with function', () => {
    const formulaText = 'x + cos(1)'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocksFromNode(parseResult.data)
    expect(result).toEqual([
      { type: 'VARIABLE', name: 'x' },
      { type: 'EXPRESSION', text: '+' },
      { type: 'FUNCTION', func: 'cos' },
      { type: 'EXPRESSION', text: '(' },
      { type: 'EXPRESSION', text: '1' },
      { type: 'EXPRESSION', text: ')' },
    ])
  })

  it('Expression with vector', () => {
    const formulaText = '2 + [1, 2, 3]'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocksFromNode(parseResult.data)
    expect(result).toEqual([
      { type: 'EXPRESSION', text: '2' },
      { type: 'EXPRESSION', text: '+' },
      { type: 'EXPRESSION', text: '[' },
      { type: 'EXPRESSION', text: '1' },
      { type: 'EXPRESSION', text: ',' },
      { type: 'EXPRESSION', text: '2' },
      { type: 'EXPRESSION', text: ',' },
      { type: 'EXPRESSION', text: '3' },
      { type: 'EXPRESSION', text: ']' },
    ])
  })

  it('Vector with function inside', () => {
    const formulaText = '[1, 2, cos(10)]'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocksFromNode(parseResult.data)
    expect(result).toEqual([
      { type: 'EXPRESSION', text: '[' },
      { type: 'EXPRESSION', text: '1' },
      { type: 'EXPRESSION', text: ',' },
      { type: 'EXPRESSION', text: '2' },
      { type: 'EXPRESSION', text: ',' },
      { type: 'FUNCTION', func: 'cos' },
      { type: 'EXPRESSION', text: '(' },
      { type: 'EXPRESSION', text: '10' },
      { type: 'EXPRESSION', text: ')' },
      { type: 'EXPRESSION', text: ']' },
    ])
  })

  it('Function with expression inside', () => {
    const formulaText = 'cos(1 + 2 + sin(30))'
    const parseResult = parse(formulaText)
    if (parseResult.status === 'ERROR') {
      throw new Error('Invalid formula')
    }
    const result = getBlocksFromNode(parseResult.data)

    expect(result).toEqual([
      { type: 'FUNCTION', func: 'cos' },
      { type: 'EXPRESSION', text: '(' },
      { type: 'EXPRESSION', text: '1' },
      { type: 'EXPRESSION', text: '+' },
      { type: 'EXPRESSION', text: '2' },
      { type: 'EXPRESSION', text: '+' },
      { type: 'FUNCTION', func: 'sin' },
      { type: 'EXPRESSION', text: '(' },
      { type: 'EXPRESSION', text: '30' },
      { type: 'EXPRESSION', text: ')' },
      { type: 'EXPRESSION', text: ')' },
    ])
  })
})
