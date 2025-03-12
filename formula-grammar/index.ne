@include "./number.ne"
@include "./unary-operator.ne"

expression -> 
    unary  {% data => data[0] %}
    | number {% data => data[0] %}