binary_expression[F, M, L] -> $F $M $L {% data => ({ inputs: [data[0], data[2]] }) %}

binary_operator[T, O] -> $T ($O $T):+ {% data => [data[0], ...data[1].map(item => item[1])] %}

expression_binary_operator_expression[T] -> 
    $T {% id %}
    | binary_operator[$T {% id %}, "+"] {% data => ({ type: "ADD", inputs: flatten(data) }) %}
    | binary_operator[$T {% id %}, "-"] {% data => ({ type: "SUB", inputs: flatten(data) }) %}

term_binary_operator_expression[T] ->
    $T {% id %}
    | binary_operator[$T {% id %}, "*" {% id %}] {% data => ({ type: "MUL", inputs: flatten(data) }) %}
    | binary_operator[$T {% id %}, "/" {% id %}] {% data => ({ type: "DIV", inputs: flatten(data) }) %}
    | binary_operator[$T {% id %}, "%" {% id %}] {% data => ({ type: "MOD", inputs: flatten(data) }) %}

