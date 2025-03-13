@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"

expression -> vector_expression {% d => d[0] %} | number_expression {% d => d[0] %}

vector_expression ->
    unary[vector {% d => d[0] %}] {% d => ({ type: "VECTOR_EXPRESSION", expression: d[0]}) %}
    | vector {% d => ({ type: "VECTOR_EXPRESSION", expression: d[0]}) %}

number_expression -> 
    unary[number {% d => d[0] %}] {% d => ({ type: "NUMBER_EXPRESSION", expression: d[0]}) %}
    | number {% d => ({ type: "NUMBER_EXPRESSION", expression: d[0]}) %}
