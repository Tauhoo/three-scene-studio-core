# prefix unary operators
@include "./number.ne"

minus_prefix_unary_operator[E] -> "-" $E {%
    d => {
        return {
            type: "MINUS_PREFIX_UNARY",
            input: d[1],
            id: uuidV4()
        }
    }
%}

prefix_unary_operator[E] -> minus_prefix_unary_operator[$E {% id %}] {% id %}

unary_operator[E] -> prefix_unary_operator[$E {% id %} ] {% id %}