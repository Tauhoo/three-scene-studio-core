number_function[E] -> 
    "sin(" $E ")" {% d => ({ type: "SIN_FUNCTION", input: d[1] }) %}
    | "cos(" $E ")" {% d => ({ type: "COS_FUNCTION", input: d[1] }) %}
    | "tan(" $E ")" {% d => ({ type: "TAN_FUNCTION", input: d[1] }) %}
    | "atan(" $E ")" {% d => ({ type: "ATAN_FUNCTION", input: d[1] }) %}
    | "abs(" $E ")" {% d => ({ type: "ABS_FUNCTION", input: d[1] }) %}

vector_function[E] ->
    "dot(" $E "," $E ")" {% d => ({ type: "DOT_FUNCTION", inputs: [d[1], d[3]] }) %}
    | "cross(" $E "," $E ")" {% d => ({ type: "CROSS_FUNCTION", inputs: [d[1], d[3]] }) %}
    | "normalize(" $E ")" {% d => ({ type: "NORMALIZE_FUNCTION", input: d[1] }) %} 