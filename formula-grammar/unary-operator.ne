# prefix unary operators
@include "./number.ne"

minus_prefix_unary -> "-" number {%
    data => {
        return {
            type: "MINUS_PREFIX_UNARY",
            input: data[1],
            text: "-"
        }
    }
%}

prefix_unary -> minus_prefix_unary {% data => data[0] %}

unary -> prefix_unary {% data => data[0] %}