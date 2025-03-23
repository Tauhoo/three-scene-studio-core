import { parse } from '../../parse'

describe('Binary Operator Parser', () => {
  describe('Addition', () => {
    it('should parse simple addition', () => {
      const result = parse('1 + 2')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'ADD',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          ],
        },
      })
    })

    it('should parse chained additions', () => {
      const result = parse('1 + 2 + 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'ADD',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })
  })

  describe('Subtraction', () => {
    it('should parse simple subtraction', () => {
      const result = parse('5 - 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 5, text: '5' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse chained subtractions', () => {
      const result = parse('10 - 4 - 2')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 10, text: '10' },
            { id: expect.any(String), type: 'NUMBER', value: 4, text: '4' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          ],
        },
      })
    })
  })

  describe('Multiplication', () => {
    it('should parse simple multiplication', () => {
      const result = parse('2 * 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MUL',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse chained multiplications', () => {
      const result = parse('2 * 3 * 4')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MUL',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
            { id: expect.any(String), type: 'NUMBER', value: 4, text: '4' },
          ],
        },
      })
    })
  })

  describe('Division', () => {
    it('should parse simple division', () => {
      const result = parse('6 / 2')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'DIV',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 6, text: '6' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          ],
        },
      })
    })

    it('should parse chained divisions', () => {
      const result = parse('12 / 3 / 2')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'DIV',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 12, text: '12' },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
            { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
          ],
        },
      })
    })
  })

  describe('Modulo', () => {
    it('should parse simple modulo', () => {
      const result = parse('7 % 4')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'MOD',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 7, text: '7' },
            { id: expect.any(String), type: 'NUMBER', value: 4, text: '4' },
          ],
        },
      })
    })
  })

  describe('Operator Precedence', () => {
    it('should respect multiplication over addition', () => {
      const result = parse('1 + 2 * 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'ADD',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
                { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
              ],
            },
          ],
        },
      })
    })

    it('should respect multiplication over addition', () => {
      const result = parse('2 * 3 + 1')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'ADD',
          inputs: [
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
                { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
              ],
            },
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
          ],
        },
      })
    })

    it('should respect division over addition', () => {
      const result = parse('1 + 6 / 2')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'ADD',
          inputs: [
            { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
            {
              id: expect.any(String),
              type: 'DIV',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 6, text: '6' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
          ],
        },
      })
    })
  })

  describe('Mix Same Level Operators', () => {
    it('should parse addition and subtraction at the same level', () => {
      const result = parse('1 + 2 - 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
            {
              id: expect.any(String),
              type: 'ADD',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 1, text: '1' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse multiplication and division at the same level', () => {
      const result = parse('6 * 2 / 3')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'DIV',
          inputs: [
            {
              id: expect.any(String),
              type: 'MUL',
              inputs: [
                { id: expect.any(String), type: 'NUMBER', value: 6, text: '6' },
                { id: expect.any(String), type: 'NUMBER', value: 2, text: '2' },
              ],
            },
            { id: expect.any(String), type: 'NUMBER', value: 3, text: '3' },
          ],
        },
      })
    })

    it('should parse addition, subtraction, multiplication, and division at the same level', () => {
      const result = parse('1 + 2 - 3 * 4 / 5')
      expect(result).toEqual({
        status: 'SUCCESS',
        data: {
          id: expect.any(String),
          type: 'SUB',
          inputs: [
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
              type: 'DIV',
              inputs: [
                {
                  id: expect.any(String),
                  type: 'MUL',
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
                { id: expect.any(String), type: 'NUMBER', value: 5, text: '5' },
              ],
            },
          ],
        },
      })
    })
  })
})
