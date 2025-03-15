@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"

expression -> 
    vector_expression {% d => ({ type: "VECTOR_EXPRESSION", expression: d[0]}) %} 
    | number_expression {% d => ({ type: "NUMBER_EXPRESSION", expression: d[0]}) %} 

vector_expression ->
    vector_term {% d => d[0]%}
    | expression_binary_operator[vector_term {% d => d[0] %}, vector_expression {% d => d[0] %}] {% d => d[0]%}

number_expression -> 
    number_term {% d => d[0]%}
    | expression_binary_operator[number_term {% d => d[0] %}, number_expression {% d => d[0] %}] {% d => d[0]%}

parentheses_expression[E] -> "(" $E ")" {% data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] }) %}

vector_term -> 
    vector {% d => d[0] %}
    | unary_operator[vector {% d => d[0] %}] {% d => d[0] %}
    | term_binary_operator[vector_term {% d => d[0] %}, vector_term {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[vector_term {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[vector_expression {% d => d[0] %}] {% d => d[0] %}

number_term -> 
    number {% d => d[0] %}
    | unary_operator[number {% d => d[0] %}] {% d => d[0] %}
    | term_binary_operator[number_term {% d => d[0] %}, number_term {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[number_term {% d => d[0] %}] {% d => d[0] %}
    | parentheses_expression[number_expression {% d => d[0] %}] {% d => d[0] %}
