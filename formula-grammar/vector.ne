vector_items[E] -> $E ("," $E):* {% d => {
    const items = [d[0], ...d[1].map(([_, expr]) => expr)]
    return items
} %}

vector[E] -> "[" vector_items[$E {% id %}]:? "]" {% d => {
    const items = d[1] ?? []
    return { type: "VECTOR", items, id: uuidV4() }
} %}