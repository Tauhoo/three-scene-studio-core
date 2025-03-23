expression_binary_operator_expression -> 
    unary_term {% id %}
    | expression_binary_operator_expression "+" unary_term {% data => ({ type: "ADD", inputs: [data[0], data[2]] }) %}
    | expression_binary_operator_expression "-" unary_term {% data => ({ type: "SUB", inputs: [data[0], data[2]] }) %}

term_binary_operator_expression ->
    short_multiply {% id %}
    | term_binary_operator_expression "*" short_multiply {% data => ({ type: "MUL", inputs: [data[0], data[2]] }) %}
    | term_binary_operator_expression "/" short_multiply {% data => ({ type: "DIV", inputs: [data[0], data[2]] }) %}
    | term_binary_operator_expression "%" short_multiply {% data => ({ type: "MOD", inputs: [data[0], data[2]] }) %}

