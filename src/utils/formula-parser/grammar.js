// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": ["number$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "number$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$ebnf$1", "number$ebnf$2"], "postprocess":  
        d => {
            let text = d[0].join("")
        
            if(d[1] !== null){
                text += "." + d[1][1].join("")
            }
            
            return { type: "NUMBER", value: Number(text) }
        } 
        },
    {"name": "vector_element_primary", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "vector_element_primary", "symbols": [{"literal":"("}, "vector_element_expression", {"literal":")"}], "postprocess": d => ({ type: "PARENTHESES_EXPRESSION", expression: d[1] })},
    {"name": "vector_element_unary", "symbols": ["vector_element_primary"], "postprocess": d => d[0]},
    {"name": "vector_element_unary$macrocall$2", "symbols": ["vector_element_primary"], "postprocess": d => d[0]},
    {"name": "vector_element_unary$macrocall$1$macrocall$2", "symbols": ["vector_element_unary$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_unary$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_element_unary$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_unary$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_element_unary$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_element_unary$macrocall$1$macrocall$1", "symbols": ["vector_element_unary$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_element_unary$macrocall$1", "symbols": ["vector_element_unary$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_element_unary", "symbols": ["vector_element_unary$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative", "symbols": ["vector_element_unary"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$2", "symbols": ["vector_element_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$3", "symbols": ["vector_element_unary"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$2", "symbols": ["vector_element_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$4", "symbols": ["vector_element_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$1", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$2", "vector_element_multiplicative$macrocall$1$macrocall$3", "vector_element_multiplicative$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_element_multiplicative$macrocall$1", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$6", "symbols": ["vector_element_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$8", "symbols": ["vector_element_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$5", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$6", "vector_element_multiplicative$macrocall$1$macrocall$7", "vector_element_multiplicative$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_element_multiplicative$macrocall$1", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$10", "symbols": ["vector_element_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$12", "symbols": ["vector_element_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_element_multiplicative$macrocall$1$macrocall$9", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$10", "vector_element_multiplicative$macrocall$1$macrocall$11", "vector_element_multiplicative$macrocall$1$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_element_multiplicative$macrocall$1", "symbols": ["vector_element_multiplicative$macrocall$1$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_element_multiplicative", "symbols": ["vector_element_multiplicative$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_element_expression", "symbols": ["vector_element_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$2", "symbols": ["vector_element_expression"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$3", "symbols": ["vector_element_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$1$macrocall$2", "symbols": ["vector_element_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "vector_element_expression$macrocall$1$macrocall$4", "symbols": ["vector_element_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$1$macrocall$1", "symbols": ["vector_element_expression$macrocall$1$macrocall$2", "vector_element_expression$macrocall$1$macrocall$3", "vector_element_expression$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_element_expression$macrocall$1", "symbols": ["vector_element_expression$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_element_expression$macrocall$1$macrocall$6", "symbols": ["vector_element_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$1$macrocall$7", "symbols": [{"literal":"-"}]},
    {"name": "vector_element_expression$macrocall$1$macrocall$8", "symbols": ["vector_element_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_element_expression$macrocall$1$macrocall$5", "symbols": ["vector_element_expression$macrocall$1$macrocall$6", "vector_element_expression$macrocall$1$macrocall$7", "vector_element_expression$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_element_expression$macrocall$1", "symbols": ["vector_element_expression$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "SUB_BINARY", inputs: data[0].inputs })},
    {"name": "vector_element_expression", "symbols": ["vector_element_expression$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_items$ebnf$1", "symbols": []},
    {"name": "vector_items$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "vector_element_expression"]},
    {"name": "vector_items$ebnf$1", "symbols": ["vector_items$ebnf$1", "vector_items$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "vector_items", "symbols": ["vector_element_expression", "vector_items$ebnf$1"], "postprocess":  d => {
            const items = [d[0], ...d[1].map(([_, expr]) => expr)]
            return items
        } },
    {"name": "vector$ebnf$1", "symbols": ["vector_items"], "postprocess": id},
    {"name": "vector$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "vector", "symbols": [{"literal":"["}, "vector$ebnf$1", {"literal":"]"}], "postprocess":  d => {
            const items = d[1] || []
            return { type: "VECTOR", items }
        } },
    {"name": "expression", "symbols": ["vector_expression"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "expression", "symbols": ["number_expression"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "vector_expression", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_expression", "symbols": ["vector_operation"], "postprocess": d => d[0]},
    {"name": "vector_operation", "symbols": ["vector_additive"], "postprocess": d => d[0]},
    {"name": "vector_additive", "symbols": ["vector_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$2", "symbols": ["vector_additive"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$3", "symbols": ["vector_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$1$macrocall$2", "symbols": ["vector_additive$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "vector_additive$macrocall$1$macrocall$4", "symbols": ["vector_additive$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$1$macrocall$1", "symbols": ["vector_additive$macrocall$1$macrocall$2", "vector_additive$macrocall$1$macrocall$3", "vector_additive$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_additive$macrocall$1", "symbols": ["vector_additive$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_additive$macrocall$1$macrocall$6", "symbols": ["vector_additive$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$1$macrocall$7", "symbols": [{"literal":"-"}]},
    {"name": "vector_additive$macrocall$1$macrocall$8", "symbols": ["vector_additive$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_additive$macrocall$1$macrocall$5", "symbols": ["vector_additive$macrocall$1$macrocall$6", "vector_additive$macrocall$1$macrocall$7", "vector_additive$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_additive$macrocall$1", "symbols": ["vector_additive$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "SUB_BINARY", inputs: data[0].inputs })},
    {"name": "vector_additive", "symbols": ["vector_additive$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative", "symbols": ["vector_unary"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$2", "symbols": ["vector_multiplicative"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$3", "symbols": ["vector_unary"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$2", "symbols": ["vector_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$4", "symbols": ["vector_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$1", "symbols": ["vector_multiplicative$macrocall$1$macrocall$2", "vector_multiplicative$macrocall$1$macrocall$3", "vector_multiplicative$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_multiplicative$macrocall$1", "symbols": ["vector_multiplicative$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "vector_multiplicative$macrocall$1$macrocall$6", "symbols": ["vector_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$8", "symbols": ["vector_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$5", "symbols": ["vector_multiplicative$macrocall$1$macrocall$6", "vector_multiplicative$macrocall$1$macrocall$7", "vector_multiplicative$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_multiplicative$macrocall$1", "symbols": ["vector_multiplicative$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "vector_multiplicative$macrocall$1$macrocall$10", "symbols": ["vector_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$12", "symbols": ["vector_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_multiplicative$macrocall$1$macrocall$9", "symbols": ["vector_multiplicative$macrocall$1$macrocall$10", "vector_multiplicative$macrocall$1$macrocall$11", "vector_multiplicative$macrocall$1$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_multiplicative$macrocall$1", "symbols": ["vector_multiplicative$macrocall$1$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_multiplicative", "symbols": ["vector_multiplicative$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_unary", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$2", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$1$macrocall$2", "symbols": ["vector_unary$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_unary$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_unary$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_unary$macrocall$1$macrocall$1", "symbols": ["vector_unary$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$1", "symbols": ["vector_unary$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_unary", "symbols": ["vector_unary$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$4", "symbols": ["vector_operation"], "postprocess": d => d[0]},
    {"name": "vector_unary$macrocall$3", "symbols": [{"literal":"("}, "vector_unary$macrocall$4", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "vector_unary", "symbols": ["vector_unary$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_primary", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_primary$macrocall$2", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "number_primary$macrocall$1", "symbols": [{"literal":"("}, "number_primary$macrocall$2", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "number_primary", "symbols": ["number_primary$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_unary", "symbols": ["number_primary"], "postprocess": d => d[0]},
    {"name": "number_unary$macrocall$2", "symbols": ["number_primary"], "postprocess": d => d[0]},
    {"name": "number_unary$macrocall$1$macrocall$2", "symbols": ["number_unary$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_unary$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_unary$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_unary$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_unary$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "number_unary$macrocall$1$macrocall$1", "symbols": ["number_unary$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_unary$macrocall$1", "symbols": ["number_unary$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_unary", "symbols": ["number_unary$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_multiplicative", "symbols": ["number_unary"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$2", "symbols": ["number_multiplicative"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$3", "symbols": ["number_unary"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$2", "symbols": ["number_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "number_multiplicative$macrocall$1$macrocall$4", "symbols": ["number_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$1", "symbols": ["number_multiplicative$macrocall$1$macrocall$2", "number_multiplicative$macrocall$1$macrocall$3", "number_multiplicative$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_multiplicative$macrocall$1", "symbols": ["number_multiplicative$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "number_multiplicative$macrocall$1$macrocall$6", "symbols": ["number_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "number_multiplicative$macrocall$1$macrocall$8", "symbols": ["number_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$5", "symbols": ["number_multiplicative$macrocall$1$macrocall$6", "number_multiplicative$macrocall$1$macrocall$7", "number_multiplicative$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_multiplicative$macrocall$1", "symbols": ["number_multiplicative$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "number_multiplicative$macrocall$1$macrocall$10", "symbols": ["number_multiplicative$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "number_multiplicative$macrocall$1$macrocall$12", "symbols": ["number_multiplicative$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_multiplicative$macrocall$1$macrocall$9", "symbols": ["number_multiplicative$macrocall$1$macrocall$10", "number_multiplicative$macrocall$1$macrocall$11", "number_multiplicative$macrocall$1$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_multiplicative$macrocall$1", "symbols": ["number_multiplicative$macrocall$1$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "number_multiplicative", "symbols": ["number_multiplicative$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression", "symbols": ["number_multiplicative"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$2", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$3", "symbols": ["number_multiplicative"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "number_expression$macrocall$1$macrocall$4", "symbols": ["number_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$2", "number_expression$macrocall$1$macrocall$3", "number_expression$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD_BINARY", inputs: data[0].inputs })},
    {"name": "number_expression$macrocall$1$macrocall$6", "symbols": ["number_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$7", "symbols": [{"literal":"-"}]},
    {"name": "number_expression$macrocall$1$macrocall$8", "symbols": ["number_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$5", "symbols": ["number_expression$macrocall$1$macrocall$6", "number_expression$macrocall$1$macrocall$7", "number_expression$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "SUB_BINARY", inputs: data[0].inputs })},
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": d => d[0]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
