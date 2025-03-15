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
    {"name": "expression", "symbols": ["vector_expression"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "expression", "symbols": ["number_expression"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "vector_expression", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$3", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "vector_expression$macrocall$1$macrocall$4", "symbols": ["vector_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$2", "vector_expression$macrocall$1$macrocall$3", "vector_expression$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_expression$macrocall$1$macrocall$6", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$7", "symbols": [{"literal":"-"}]},
    {"name": "vector_expression$macrocall$1$macrocall$8", "symbols": ["vector_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$5", "symbols": ["vector_expression$macrocall$1$macrocall$6", "vector_expression$macrocall$1$macrocall$7", "vector_expression$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "SUB_BINARY", inputs: data[0].inputs })},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$2", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$3", "symbols": ["number_expression"], "postprocess": d => d[0]},
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
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$2", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$2", "symbols": ["vector_term$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_term$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_term$macrocall$1$macrocall$1", "symbols": ["vector_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1", "symbols": ["vector_term$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$4", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$5", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$2", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "vector_term$macrocall$3$macrocall$4", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$1", "symbols": ["vector_term$macrocall$3$macrocall$2", "vector_term$macrocall$3$macrocall$3", "vector_term$macrocall$3$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term$macrocall$3$macrocall$6", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "vector_term$macrocall$3$macrocall$8", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$5", "symbols": ["vector_term$macrocall$3$macrocall$6", "vector_term$macrocall$3$macrocall$7", "vector_term$macrocall$3$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term$macrocall$3$macrocall$10", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "vector_term$macrocall$3$macrocall$12", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$9", "symbols": ["vector_term$macrocall$3$macrocall$10", "vector_term$macrocall$3$macrocall$11", "vector_term$macrocall$3$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$7", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$6", "symbols": [{"literal":"("}, "vector_term$macrocall$7", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$6"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$9", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$8", "symbols": [{"literal":"("}, "vector_term$macrocall$9", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$8"], "postprocess": d => d[0]},
    {"name": "number_term", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$2", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$2", "symbols": ["number_term$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_term$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "number_term$macrocall$1$macrocall$1", "symbols": ["number_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1", "symbols": ["number_term$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term", "symbols": ["number_term$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$4", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$5", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$2", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "number_term$macrocall$3$macrocall$4", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$1", "symbols": ["number_term$macrocall$3$macrocall$2", "number_term$macrocall$3$macrocall$3", "number_term$macrocall$3$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "number_term$macrocall$3$macrocall$6", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "number_term$macrocall$3$macrocall$8", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$5", "symbols": ["number_term$macrocall$3$macrocall$6", "number_term$macrocall$3$macrocall$7", "number_term$macrocall$3$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "number_term$macrocall$3$macrocall$10", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "number_term$macrocall$3$macrocall$12", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$9", "symbols": ["number_term$macrocall$3$macrocall$10", "number_term$macrocall$3$macrocall$11", "number_term$macrocall$3$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "number_term", "symbols": ["number_term$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$7", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$6", "symbols": [{"literal":"("}, "number_term$macrocall$7", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "number_term", "symbols": ["number_term$macrocall$6"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$9", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$8", "symbols": [{"literal":"("}, "number_term$macrocall$9", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "number_term", "symbols": ["number_term$macrocall$8"], "postprocess": d => d[0]},
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
    {"name": "expression", "symbols": ["vector_expression"], "postprocess": d => ({ type: "VECTOR_EXPRESSION", expression: d[0]})},
    {"name": "expression", "symbols": ["number_expression"], "postprocess": d => ({ type: "NUMBER_EXPRESSION", expression: d[0]})},
    {"name": "vector_expression", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$2", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$3", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$2", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "vector_expression$macrocall$1$macrocall$4", "symbols": ["vector_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$2", "vector_expression$macrocall$1$macrocall$3", "vector_expression$macrocall$1$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_expression$macrocall$1$macrocall$6", "symbols": ["vector_expression$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$7", "symbols": [{"literal":"-"}]},
    {"name": "vector_expression$macrocall$1$macrocall$8", "symbols": ["vector_expression$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_expression$macrocall$1$macrocall$5", "symbols": ["vector_expression$macrocall$1$macrocall$6", "vector_expression$macrocall$1$macrocall$7", "vector_expression$macrocall$1$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_expression$macrocall$1", "symbols": ["vector_expression$macrocall$1$macrocall$5"], "postprocess": data => ({ type: "SUB_BINARY", inputs: data[0].inputs })},
    {"name": "vector_expression", "symbols": ["vector_expression$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_expression", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$2", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_expression$macrocall$3", "symbols": ["number_expression"], "postprocess": d => d[0]},
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
    {"name": "number_expression", "symbols": ["number_expression$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$2", "symbols": ["vector"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$2", "symbols": ["vector_term$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["vector_term$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "vector_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "vector_term$macrocall$1$macrocall$1", "symbols": ["vector_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$1", "symbols": ["vector_term$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$1"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$4", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$5", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$2", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "vector_term$macrocall$3$macrocall$4", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$1", "symbols": ["vector_term$macrocall$3$macrocall$2", "vector_term$macrocall$3$macrocall$3", "vector_term$macrocall$3$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term$macrocall$3$macrocall$6", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "vector_term$macrocall$3$macrocall$8", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$5", "symbols": ["vector_term$macrocall$3$macrocall$6", "vector_term$macrocall$3$macrocall$7", "vector_term$macrocall$3$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term$macrocall$3$macrocall$10", "symbols": ["vector_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "vector_term$macrocall$3$macrocall$12", "symbols": ["vector_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$3$macrocall$9", "symbols": ["vector_term$macrocall$3$macrocall$10", "vector_term$macrocall$3$macrocall$11", "vector_term$macrocall$3$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "vector_term$macrocall$3", "symbols": ["vector_term$macrocall$3$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$3"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$7", "symbols": ["vector_term"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$6", "symbols": [{"literal":"("}, "vector_term$macrocall$7", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$6"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$9", "symbols": ["vector_expression"], "postprocess": d => d[0]},
    {"name": "vector_term$macrocall$8", "symbols": [{"literal":"("}, "vector_term$macrocall$9", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "vector_term", "symbols": ["vector_term$macrocall$8"], "postprocess": d => d[0]},
    {"name": "number_term", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$2", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$2", "symbols": ["number_term$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_term$macrocall$1$macrocall$2"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "number_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "number_term$macrocall$1$macrocall$1", "symbols": ["number_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$1", "symbols": ["number_term$macrocall$1$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term", "symbols": ["number_term$macrocall$1"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$4", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$5", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$2", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$3", "symbols": [{"literal":"*"}]},
    {"name": "number_term$macrocall$3$macrocall$4", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$1", "symbols": ["number_term$macrocall$3$macrocall$2", "number_term$macrocall$3$macrocall$3", "number_term$macrocall$3$macrocall$4"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$1"], "postprocess": data => ({ type: "MUL_BINARY", inputs: data[0].inputs })},
    {"name": "number_term$macrocall$3$macrocall$6", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$7", "symbols": [{"literal":"/"}]},
    {"name": "number_term$macrocall$3$macrocall$8", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$5", "symbols": ["number_term$macrocall$3$macrocall$6", "number_term$macrocall$3$macrocall$7", "number_term$macrocall$3$macrocall$8"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$5"], "postprocess": data => ({ type: "DIV_BINARY", inputs: data[0].inputs })},
    {"name": "number_term$macrocall$3$macrocall$10", "symbols": ["number_term$macrocall$4"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$11", "symbols": [{"literal":"%"}]},
    {"name": "number_term$macrocall$3$macrocall$12", "symbols": ["number_term$macrocall$5"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$3$macrocall$9", "symbols": ["number_term$macrocall$3$macrocall$10", "number_term$macrocall$3$macrocall$11", "number_term$macrocall$3$macrocall$12"], "postprocess": data => ({ inputs: [data[0], data[2]] })},
    {"name": "number_term$macrocall$3", "symbols": ["number_term$macrocall$3$macrocall$9"], "postprocess": data => ({ type: "MOD_BINARY", inputs: data[0].inputs })},
    {"name": "number_term", "symbols": ["number_term$macrocall$3"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$7", "symbols": ["number_term"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$6", "symbols": [{"literal":"("}, "number_term$macrocall$7", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "number_term", "symbols": ["number_term$macrocall$6"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$9", "symbols": ["number_expression"], "postprocess": d => d[0]},
    {"name": "number_term$macrocall$8", "symbols": [{"literal":"("}, "number_term$macrocall$9", {"literal":")"}], "postprocess": data => ({ type: "PARENTHESES_EXPRESSION", expression: data[1] })},
    {"name": "number_term", "symbols": ["number_term$macrocall$8"], "postprocess": d => d[0]}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
