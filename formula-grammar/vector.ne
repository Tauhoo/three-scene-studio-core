@include "./expression.ne"

vector -> "[" number_expression:* "]" {% d => ({ type: "NUMBER", value: d[1]}) %}