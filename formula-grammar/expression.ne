@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"
@include "./variable.ne"

expression -> 
    unary_term {% id %}
    | expression_binary_operator[expression {% id %}, unary_term {% id %}] {% id %}

parentheses_expression[E] -> "(" $E ")" {% data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] }) %}

@{% 
    const flatten = data => {
        const result = []
        if(Array.isArray(data)){
            for(const item of data){
                result.push(...flatten(item))
            }
        }else{
            result.push(data)
        }
        return result
    }
%}

zig_short_multiply_expression[A, B] -> 
    $A 
    | $B 
    | ($A $B):+ $A:? 
    | ($B $A):+ $B:? 

short_multiply_expression[E] -> $E:+ 

full_factor ->
    parentheses_expression[expression {% id %}]
    | vector[expression {% id %}]

full_short_multiply -> short_multiply_expression[full_factor {% id %}]

zig_short_multiply -> 
    number 
    | variable
    | number variable

short_multiply -> zig_short_multiply_expression[full_short_multiply {% id %}, zig_short_multiply {% id %}] {% data =>{
    const result = flatten(data).filter(item => item !== null)
    if(result.length === 1) return result[0]
    return {type: "IMP_MUL", inputs: result}
}%}

term -> 
    short_multiply {% id %}
    | term_binary_operator[term {% id %}, short_multiply {% id %}] {% id %}

unary_term ->
    term {% id %}
    | unary_operator[term {% id %}] {% id %}
