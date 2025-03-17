# prefix unary operators
@include "./number.ne"

minus_prefix_unary_operator[E] -> "-" $E {%
    d => {
        return {
            type: "MINUS_PREFIX_UNARY",
            input: d[1]
        }
    }
%}

prefix_unary_operator[E] -> minus_prefix_unary_operator[$E {% d => d[0] %}] {% d => d[0] %}

unary_operator[E] -> prefix_unary_operator[$E {% d => d[0] %} ] {% d => d[0] %}