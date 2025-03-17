binary_expression[F, M, L] -> $F $M $L {% data => ({ inputs: [data[0], data[2]] }) %}

expression_binary_operator[F, L] -> 
    binary_expression[$F {% id %}, "+", $L {% id %}] {% data => ({ type: "ADD_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% id %}, "-", $L {% id %}] {% data => ({ type: "SUB_BINARY", inputs: data[0].inputs }) %}

term_binary_operator[F, L] ->
    binary_expression[$F {% id %}, "*", $L {% id %}] {% data => ({ type: "MUL_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% id %}, "/", $L {% id %}] {% data => ({ type: "DIV_BINARY", inputs: data[0].inputs }) %}
    | binary_expression[$F {% id %}, "%", $L {% id %}] {% data => ({ type: "MOD_BINARY", inputs: data[0].inputs }) %}

