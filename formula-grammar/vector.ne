vector_items[E] -> $E ("," $E):* {% (d: any[]): any[] => {
    const items = [d[0], ...d[1].map(([_, expr]: any) => expr)]
    return items
} %}

vector[E] -> "[" vector_items[$E {% id %}]:? "]" {% (d: any[]): any => {
    const items = d[1] ?? []
    return { type: "VECTOR", items, id: uuidV4() }
} %}

vector_item_swizzle_extraction[E] -> $E "." [xyzw]:+ {% (d: any[]): any => {
    const items = d[2]
    return { type: "VECTOR_ITEM_SWIZZLE_EXTRACTION", vector: d[0], items, id: uuidV4() }
} %}

vector_item_index_extraction[E, I] -> $E "{" $I ("," $I):* "}" {% (d: any[]): any => {
    const items = [d[2], ...d[3].map(([_, expr]: any) => expr)]
    return { type: "VECTOR_ITEM_INDEX_EXTRACTION", vector: d[0], items, id: uuidV4() }
} %}