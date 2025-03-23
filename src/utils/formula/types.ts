export type FunctionNode = {
  type: 'FUNCTION'
  func: string
  inputs: FormulaNode[]
}
export interface NumberNode {
  type: 'NUMBER'
  value: number
  text: string
}

export interface VariableNode {
  type: 'VARIABLE'
  name: string
}

export interface VectorNode {
  type: 'VECTOR'
  items: FormulaNode[]
}

export interface BinaryOperationNode {
  type: 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'MOD'
  inputs: FormulaNode[]
}

export interface ImplicitMultiplicationNode {
  type: 'IMP_MUL'
  inputs: FormulaNode[]
}

export interface MinusPrefixUnaryNode {
  type: 'MINUS_PREFIX_UNARY'
  input: FormulaNode
}

export interface ParenthesesExpressionNode {
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
