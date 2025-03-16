@include "./number.ne"
@include "./vector.ne"
@include "./function.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"

# Main expression types
expression -> 
    vector_expression {% d => ({ type: "VECTOR_EXPRESSION", expression: d[0]}) %} 
    | number_expression {% d => ({ type: "NUMBER_EXPRESSION", expression: d[0]}) %} 

# Parentheses expression
parentheses_expression[E] -> "(" $E ")" {% data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] }) %}

# Vector expressions - simplified to remove ambiguity
vector_factor -> 
    parentheses_expression[vector_expression {% d => d[0] %}] {% d => d[0] %}
    | vector_function[vector_expression {% d => d[0] %}] {% d => d[0] %}

vector_short_multiply ->
    vector {% d => d[0] %}
    | vector_factor {% d => d[0] %}
    | vector_short_multiply vector_factor {% data => ({ type: "MUL_BINARY", inputs: data}) %}

vector_term -> 
    vector_short_multiply {% d => d[0] %}
    | term_binary_operator[vector_term {% d => d[0] %}, vector_short_multiply {% d => d[0] %}] {% d => d[0] %}

vector_expression -> 
    vector_term {% d => d[0] %}
    | unary_operator[vector_term {% d => d[0] %}] {% d => d[0] %}
    | expression_binary_operator[vector_expression {% d => d[0] %}, vector_term {% d => d[0] %}] {% d => d[0] %}

# Number expressions
number_factor -> 
    parentheses_expression[number_expression {% d => d[0] %}] {% d => d[0] %}
    | number_function[number_expression {% d => d[0] %}] {% d => d[0] %}

number_short_multiply ->
    number {% d => d[0] %}
    | number_factor {% d => d[0] %}
    | number_short_multiply number_factor {% data => ({ type: "MUL_BINARY", inputs: data}) %}

number_term -> 
    number_short_multiply {% d => d[0] %}
    | term_binary_operator[number_term {% d => d[0] %}, number_short_multiply {% d => d[0] %}] {% d => d[0] %}

number_expression -> 
    number_term {% d => d[0] %}
    | unary_operator[number_term {% d => d[0] %}] {% d => d[0] %}
    | expression_binary_operator[number_expression {% d => d[0] %}, number_term {% d => d[0] %}] {% d => d[0] %}
