vector_items[E] -> $E ("," $E):* {% (d: any[]): any[] => {
    const items = [d[0], ...d[1].map(([_, expr]: any) => expr)]
    return items
} %}

vector[E] -> "[" vector_items[$E {% id %}]:? "]" {% (d: any[]): any => {
    const items = d[1] ?? []
    return { type: "VECTOR", items, id: uuidV4() }
} %}