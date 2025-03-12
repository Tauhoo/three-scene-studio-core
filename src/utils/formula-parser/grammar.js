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
    {"name": "minus_prefix_unary", "symbols": [{"literal":"-"}, "number"], "postprocess": 
        data => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: data[1],
                text: "-"
            }
        }
        },
    {"name": "prefix_unary", "symbols": ["minus_prefix_unary"], "postprocess": data => data[0]},
    {"name": "unary", "symbols": ["prefix_unary"], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["unary"], "postprocess": data => data[0]},
    {"name": "expression", "symbols": ["number"], "postprocess": data => data[0]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
