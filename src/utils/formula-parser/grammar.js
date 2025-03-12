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
        data => {
            let text = data[0].join("")
        
            if(data[1] !== null){
                text += "." + data[1][1].join("")
            }
            
            return { type: "NUMBER", value: Number(text), text }
        } 
        },
    {"name": "number_expression$macrocall$2", "symbols": ["number"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$2"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$1$macrocall$2"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        data => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: data[1],
                text: "-"
            }
        }
        },
    {"name": "number_expression$macrocall$1$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": data => ({ type: "NUMBER_EXPRESSION", expression: data[0]})},
    {"name": "number_expression", "symbols": ["number"], "postprocess": data => ({ type: "NUMBER_EXPRESSION", expression: data[0]})},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$1$macrocall$2"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        data => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: data[1],
                text: "-"
            }
        }
        },
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": data => ({ type: "VECTOR_EXPRESSION", expression: data[0]})},
    {"name": "vector_expression", "symbols": ["vector"], "postprocess": data => ({ type: "VECTOR_EXPRESSION", expression: data[0]})},
    {"name": "vector$ebnf$1", "symbols": []},
    {"name": "vector$ebnf$1", "symbols": ["vector$ebnf$1", "number_expression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "vector", "symbols": [{"literal":"["}, "vector$ebnf$1", {"literal":"]"}], "postprocess": data => ({ type: "NUMBER", value: data[1]})},
    {"name": "number_expression$macrocall$2", "symbols": ["number"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$2"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_expression$macrocall$1$macrocall$2"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        data => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: data[1],
                text: "-"
            }
        }
        },
    {"name": "number_expression$macrocall$1$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "number_expression$macrocall$1", "symbols": ["number_expression$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": data => ({ type: "NUMBER_EXPRESSION", expression: data[0]})},
    {"name": "number_expression", "symbols": ["number"], "postprocess": data => ({ type: "NUMBER_EXPRESSION", expression: data[0]})},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$1$macrocall$2"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_expression$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        data => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: data[1],
                text: "-"
            }
        }
        },
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": data => data[0]},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": data => ({ type: "VECTOR_EXPRESSION", expression: data[0]})},
    {"name": "vector_expression", "symbols": ["vector"], "postprocess": data => ({ type: "VECTOR_EXPRESSION", expression: data[0]})}
]
  , ParserStart: "number_expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
