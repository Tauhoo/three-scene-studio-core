import { parse } from './index'

describe('Binary Operator Parser', () => {
  describe('Addition', () => {
    it('should parse simple addition', () => {
      const result = parse('1 + 2')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ADD_BINARY',
          inputs: [
            { type: 'NUMBER', value: 1 },
            { type: 'NUMBER', value: 2 },
          ],
        },
      })
    })

    it('should parse chained additions', () => {
      const result = parse('1 + 2 + 3')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ADD_BINARY',
          inputs: [
            {
              type: 'ADD_BINARY',
              inputs: [
                { type: 'NUMBER', value: 1 },
                { type: 'NUMBER', value: 2 },
              ],
            },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })
  })

  describe('Subtraction', () => {
    it('should parse simple subtraction', () => {
      const result = parse('5 - 3')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'SUB_BINARY',
          inputs: [
            { type: 'NUMBER', value: 5 },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })

    it('should parse chained subtractions', () => {
      const result = parse('10 - 4 - 2')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'SUB_BINARY',
          inputs: [
            {
              type: 'SUB_BINARY',
              inputs: [
                { type: 'NUMBER', value: 10 },
                { type: 'NUMBER', value: 4 },
              ],
            },
            { type: 'NUMBER', value: 2 },
          ],
        },
      })
    })
  })

  describe('Multiplication', () => {
    it('should parse simple multiplication', () => {
      const result = parse('2 * 3')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            { type: 'NUMBER', value: 2 },
            { type: 'NUMBER', value: 3 },
          ],
        },
      })
    })

    it('should parse chained multiplications', () => {
      const result = parse('2 * 3 * 4')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MUL_BINARY',
          inputs: [
            {
              type: 'MUL_BINARY',
              inputs: [
                { type: 'NUMBER', value: 2 },
                { type: 'NUMBER', value: 3 },
              ],
            },
            { type: 'NUMBER', value: 4 },
          ],
        },
      })
    })
  })

  describe('Division', () => {
    it('should parse simple division', () => {
      const result = parse('6 / 2')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'DIV_BINARY',
          inputs: [
            { type: 'NUMBER', value: 6 },
            { type: 'NUMBER', value: 2 },
          ],
        },
      })
    })

    it('should parse chained divisions', () => {
      const result = parse('12 / 3 / 2')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'DIV_BINARY',
          inputs: [
            {
              type: 'DIV_BINARY',
              inputs: [
                { type: 'NUMBER', value: 12 },
                { type: 'NUMBER', value: 3 },
              ],
            },
            { type: 'NUMBER', value: 2 },
          ],
        },
      })
    })
  })

  describe('Modulo', () => {
    it('should parse simple modulo', () => {
      const result = parse('7 % 4')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'MOD_BINARY',
          inputs: [
            { type: 'NUMBER', value: 7 },
            { type: 'NUMBER', value: 4 },
          ],
        },
      })
    })
  })

  describe('Operator Precedence', () => {
    it('should respect multiplication over addition', () => {
      const result = parse('1 + 2 * 3')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
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
      })
    })

    it('should respect division over addition', () => {
      const result = parse('1 + 6 / 2')
      expect(result).toEqual({
        type: 'NUMBER_EXPRESSION',
        expression: {
          type: 'ADD_BINARY',
          inputs: [
            { type: 'NUMBER', value: 1 },
            {
              type: 'DIV_BINARY',
              inputs: [
                { type: 'NUMBER', value: 6 },
                { type: 'NUMBER', value: 2 },
              ],
            },
          ],
        },
      })
    })
  })
})
