@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"

# Main expression types
expression -> 
    vector_expression {% d => ({ type: "VECTOR_EXPRESSION", expression: d[0]}) %} 
    | number_expression {% d => ({ type: "NUMBER_EXPRESSION", expression: d[0]}) %} 

# Parentheses expression
parentheses_expression[E] -> "(" $E ")" {% data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] }) %}

# Vector expressions - only allow vector operations with vectors
vector_expression -> 
    vector {% d => d[0] %}
    | vector_operation {% d => d[0] %}

vector_operation ->
    vector_additive {% d => d[0] %}

vector_additive ->
    vector_multiplicative {% d => d[0] %}
    | expression_binary_operator[vector_additive {% d => d[0] %}, vector_multiplicative {% d => d[0] %}] {% d => d[0] %}

vector_multiplicative ->
    vector_unary {% d => d[0] %}
    | term_binary_operator[vector_multiplicative {% d => d[0] %}, vector_unary {% d => d[0] %}] {% d => d[0] %}

vector_unary ->
    vector {% d => d[0] %}
    | unary_operator[vector {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[vector_operation {% d => d[0] %}] {% d => d[0] %}

# Number expressions - only allow number operations with numbers
number_expression -> 
    number {% d => d[0] %}
    | number_operation {% d => d[0] %}

number_operation ->
    number_additive {% d => d[0] %}

number_additive ->
    number_multiplicative {% d => d[0] %}
    | expression_binary_operator[number_additive {% d => d[0] %}, number_multiplicative {% d => d[0] %}] {% d => d[0] %}

number_multiplicative ->
    number_unary {% d => d[0] %}
    | term_binary_operator[number_multiplicative {% d => d[0] %}, number_unary {% d => d[0] %}] {% d => d[0] %}

number_unary ->
    number {% d => d[0] %}
    | unary_operator[number {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[number_operation {% d => d[0] %}] {% d => d[0] %}
