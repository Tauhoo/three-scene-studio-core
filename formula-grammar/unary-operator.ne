# prefix unary operators
@include "./number.ne"

minus_prefix_unary[E] -> "-" $E {%
    d => {
        return {
            type: "MINUS_PREFIX_UNARY",
            input: d[1]
        }
    }
%}

prefix_unary[E] -> minus_prefix_unary[$E {% d => d[0] %} ] {% d => d[0] %}

unary[E] -> prefix_unary[$E {% d => d[0] %} ] {% d => d[0] %}