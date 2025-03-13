@include "./expression.ne"

vector -> "[" (number_expression ("," number_expression):* ):? "]" {% d => {
    let items = []
    if(d[1] !== null){
        items.push(d[1][0])
        const rest = d[1][1].map(([_, ne]) => ne)
        items = [...items, ...rest]
    }
    return { type: "VECTOR", items}
 } %}