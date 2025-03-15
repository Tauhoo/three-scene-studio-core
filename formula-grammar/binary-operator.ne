binary_expression[F, M, L] -> $F $M $L {% data => ({ inputs: [data[0], data[2]] }) %}

expression_binary_operator[F, L] -> 
    binary_expression[$F {% d => d[0] %}, "+", $L {% d => d[0] %}] {% data => ({ type: "ADD_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% d => d[0] %}, "-", $L {% d => d[0] %}] {% data => ({ type: "SUB_BINARY", inputs: data[0].inputs }) %}

term_binary_operator[F, L] ->
    binary_expression[$F {% d => d[0] %}, "*", $L {% d => d[0] %}] {% data => ({ type: "MUL_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% d => d[0] %}, "/", $L {% d => d[0] %}] {% data => ({ type: "DIV_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% d => d[0] %}, "%", $L {% d => d[0] %}] {% data => ({ type: "MOD_BINARY", inputs: data[0].inputs }) %}

