@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"
@include "./variable.ne"

expression -> expression_binary_operator_expression {% id %}

parentheses_expression[E] -> "(" ($E ("," $E):*):? ")" {% data => {
    if(data[1] === null) return { type: "PARENTHESES_EXPRESSION", expressions: [] }
    const result = []
    result.push(data[1][0])
    result.push(...data[1][1].map(item => item[0]))
    return { type: "PARENTHESES_EXPRESSION", expressions: result }
} %}

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
        return result.filter(item => item !== null)
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
    const result = flatten(data)
    if(result.length === 1) return result[0]
    return {type: "IMP_MUL", inputs: result}
}%}

term -> term_binary_operator_expression {% id %}

unary_term ->
    term {% id %}
    | unary_operator[term {% id %}] {% id %}
