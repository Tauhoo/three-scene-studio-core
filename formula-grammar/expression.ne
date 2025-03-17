@include "./number.ne"
@include "./vector.ne"
@include "./unary-operator.ne"
@include "./binary-operator.ne"
@include "./variable.ne"

expression -> 
    unary_term {% d => d[0] %}
    | expression_binary_operator[expression {% d => d[0] %}, unary_term {% d => d[0] %}] {% d => d[0] %}

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
    $A {% d => d[0] %}
    | $B {% d => d[0] %}
    | ($A $B):+ $A:? {% extract_zig_multiply_expression %}
    | ($B $A):+ $B:? {% extract_zig_multiply_expression %}

short_multiply_expression[E] -> $E:+ {% data => {
    if(data[0].length === 1) return data[0][0]
    return {type: "MUL_BINARY", inputs: data[0]}
}%}

full_factor ->
    parentheses_expression[expression {% d => d[0] %}] {% d => d[0] %}
    | vector[expression {% d => d[0] %}] {% d => d[0] %}

full_short_multiply -> short_multiply_expression[full_factor {% d => d[0] %}] {% d => d[0] %}

zig_short_multiply -> 
    number {% d => d[0] %}
    | variable {% d => d[0] %}
    | number variable {% data => ({type: "MUL_BINARY", inputs: data}) %}

short_multiply -> zig_short_multiply_expression[full_short_multiply {% d => d[0] %}, zig_short_multiply {% d => d[0] %}] {% d => d[0] %}

term -> 
    short_multiply {% d => d[0] %}
    | term_binary_operator[term {% d => d[0] %}, short_multiply {% d => d[0] %}] {% d => d[0] %}

unary_term ->
    term {% d => d[0] %}
    | unary_operator[term {% d => d[0] %}] {% d => d[0] %}
