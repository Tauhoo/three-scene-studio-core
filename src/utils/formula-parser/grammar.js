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
    {"name": "expression", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "expression", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "vector_expression", "symbols": ["vector"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "number_expression$macrocall$2", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "number_expression$macrocall$1$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "number_expression", "symbols": ["number"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "vector$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "vector$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "number_expression"]},
    {"name": "vector$ebnf$1$subexpression$1$ebnf$1", "symbols": ["vector$ebnf$1$subexpression$1$ebnf$1", "vector$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "vector$ebnf$1$subexpression$1", "symbols": ["number_expression", "vector$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "vector$ebnf$1", "symbols": ["vector$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "vector$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "vector", "symbols": [{"literal":"["}, "vector$ebnf$1", {"literal":"]"}], "postprocess": d => {
           let items = []
           if(d[1] !== null){
               items.push(d[1][0])
               const rest = d[1][1].map(([_, ne]) => ne)
               items = [...items, ...rest]
           }
           return { type: "VECTOR", items}
        } },
    {"name": "expression", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "expression", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "vector_expression", "symbols": ["vector"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "number_expression$macrocall$2", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "number_expression$macrocall$1$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "number_expression", "symbols": ["number"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
