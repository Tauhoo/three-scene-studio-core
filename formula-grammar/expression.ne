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
    const extract_zig_multiply_expression = data => {
        const terms = []
        for(const pair of data[0]){
            terms.push(...pair)
        }
      
        if(data[1] !== null){
            terms.push(data[1])
        }

        const result = {type: "MUL_BINARY", inputs: []}
        let currentResult = result
        for(let i = 0; i < terms.length - 2; i++){
            currentResult.inputs.push(terms[i])
            const newCurrentResult = {type: "MUL_BINARY", inputs: []}
            currentResult.inputs.push(newCurrentResult)
            currentResult = newCurrentResult
        }
        currentResult.inputs.push(terms[terms.length - 2])
        currentResult.inputs.push(terms[terms.length - 1])
        return result
    }
%}

zig_short_multiply_expression[A, B] -> 
    $A {% id %}
    | $B {% id %}
    | ($A $B):+ $A:? {% extract_zig_multiply_expression %}
    | ($B $A):+ $B:? {% extract_zig_multiply_expression %}

short_multiply_expression[E] -> $E:+ {% data => {
    if(data[0].length === 1) return data[0][0]
    return {type: "MUL_BINARY", inputs: data[0]}
}%}

full_factor ->
    parentheses_expression[expression {% id %}] {% id %}
    | vector[expression {% id %}] {% id %}

full_short_multiply -> short_multiply_expression[full_factor {% id %}] {% id %}

zig_short_multiply -> 
    number {% id %}
    | variable {% id %}
    | number variable {% data => ({type: "MUL_BINARY", inputs: data}) %}

short_multiply -> zig_short_multiply_expression[full_short_multiply {% id %}, zig_short_multiply {% id %}] {% id %}

term -> 
    short_multiply {% id %}
    | term_binary_operator[term {% id %}, short_multiply {% id %}] {% id %}

unary_term ->
    term {% id %}
    | unary_operator[term {% id %}] {% id %}
