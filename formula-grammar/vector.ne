@include "./number.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"

# Simplified vector element expression rules
vector_element_primary -> 
    number {% d => d[0] %}
    | "(" vector_element_expression ")" {% d => ({ type: "PARENTHESES_EXPRESSION", expression: d[1] }) %}

vector_element_unary -> 
    vector_element_primary {% d => d[0] %}
    | unary_operator[vector_element_primary {% d => d[0] %}] {% d => d[0] %}

vector_element_term -> 
    vector_element_unary {% d => d[0] %}
    | term_binary_operator[vector_element_term {% d => d[0] %}, vector_element_unary {% d => d[0] %}] {% d => d[0] %}

vector_element_expression -> 
    vector_element_term {% d => d[0] %}
    | expression_binary_operator[vector_element_expression {% d => d[0] %}, vector_element_term {% d => d[0] %}] {% d => d[0] %}

vector_items -> vector_element_expression ("," vector_element_expression):* {% d => {
    const items = [d[0], ...d[1].map(([_, expr]) => expr)]
    return items
} %}

vector -> "[" vector_items:? "]" {% d => {
    const items = d[1] || []
    return { type: "VECTOR", items }
} %}