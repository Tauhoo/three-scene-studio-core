@include "./number.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"

# Define number expression rules specifically for vector elements to avoid circular dependency
vector_element_expression -> 
    number {% d => d[0] %}
    | vector_element_operation {% d => d[0] %}

vector_element_operation ->
    vector_element_additive {% d => d[0] %}

vector_element_additive ->
    vector_element_multiplicative {% d => d[0] %}
    | expression_binary_operator[vector_element_additive {% d => d[0] %}, vector_element_multiplicative {% d => d[0] %}] {% d => d[0] %}

vector_element_multiplicative ->
    vector_element_unary {% d => d[0] %}
    | term_binary_operator[vector_element_multiplicative {% d => d[0] %}, vector_element_unary {% d => d[0] %}] {% d => d[0] %}

vector_element_unary ->
    number {% d => d[0] %}
    | unary_operator[number {% d => d[0] %}] {% d => d[0] %}
    | "(" vector_element_operation ")" {% d => ({ type: "PARENTHESES_EXPRESSION", expression: d[1] }) %}

vector_items -> vector_element_expression ("," vector_element_expression):* {% d => {
    const items = [d[0], ...d[1].map(([_, expr]) => expr)]
    return items
} %}

vector -> "[" vector_items:? "]" {% d => {
    const items = d[1] || []
    return { type: "VECTOR", items }
} %}