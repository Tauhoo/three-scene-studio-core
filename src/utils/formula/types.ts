export type FunctionNode = {
  id: string
  type: 'FUNCTION'
  func: string
  inputs: FormulaNode[]
}
export interface NumberNode {
  id: string
  type: 'NUMBER'
  value: number
  text: string
}

export interface VariableNode {
  id: string
  type: 'VARIABLE'
  name: string
}

export interface VectorNode {
  id: string
  type: 'VECTOR'
  items: FormulaNode[]
}

export interface BinaryOperationNode {
  id: string
  type: 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MOD'
  inputs: FormulaNode[]
}

export interface ImplicitMultiplicationNode {
  id: string
  type: 'IMP_MUL'
  inputs: FormulaNode[]
}

export interface MinusPrefixUnaryNode {
  id: string
  type: 'MINUS_PREFIX_UNARY'
  input: FormulaNode
}

export interface ParenthesesExpressionNode {
  id: string
  type: 'PARENTHESES_EXPRESSION'
  expressions: FormulaNode[]
}

export type FormulaNode =
  | NumberNode
  | VariableNode
  | VectorNode
  | FunctionNode
  | BinaryOperationNode
  | ImplicitMultiplicationNode
  | MinusPrefixUnaryNode
  | ParenthesesExpressionNode

export type NodeValueType = 'NUMBER' | 'VECTOR'
