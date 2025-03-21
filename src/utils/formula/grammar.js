// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
 
    const flatten = data => {
        const result = []
        if(Array.isArray(data)){
            for(const item of data){
                result.push(...flatten(item))
            }
        }else{
            result.push(data)
        }
        return result.filter(item => item !== null)
    }
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
            
            return { type: "NUMBER", value: Number(text), text }
        } 
        },
    {"name": "variable$ebnf$1", "symbols": []},
    {"name": "variable$ebnf$1", "symbols": ["variable$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "variable", "symbols": [/[a-zA-Z_]/, "variable$ebnf$1"], "postprocess": data => ({ type: "VARIABLE", name: data[0]+(data[1] ?? []).join("") })},
    {"name": "expression", "symbols": ["unary_term"], "postprocess": id},
    {"name": "expression$macrocall$2", "symbols": ["unary_term"], "postprocess": id},
    {"name": "expression$macrocall$1", "symbols": ["expression$macrocall$2"], "postprocess": id},
    {"name": "expression$macrocall$1$macrocall$2", "symbols": ["expression$macrocall$2"], "postprocess": id},
    {"name": "expression$macrocall$1$macrocall$3", "symbols": [{"literal":"+"}]},
    {"name": "expression$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["expression$macrocall$1$macrocall$3", "expression$macrocall$1$macrocall$2"]},
    {"name": "expression$macrocall$1$macrocall$1$ebnf$1", "symbols": ["expression$macrocall$1$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "expression$macrocall$1$macrocall$1$ebnf$1$subexpression$2", "symbols": ["expression$macrocall$1$macrocall$3", "expression$macrocall$1$macrocall$2"]},
    {"name": "expression$macrocall$1$macrocall$1$ebnf$1", "symbols": ["expression$macrocall$1$macrocall$1$ebnf$1", "expression$macrocall$1$macrocall$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression$macrocall$1$macrocall$1", "symbols": ["expression$macrocall$1$macrocall$2", "expression$macrocall$1$macrocall$1$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(item => item[1])]},
    {"name": "expression$macrocall$1", "symbols": ["expression$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "ADD", inputs: flatten(data) })},
    {"name": "expression$macrocall$1$macrocall$5", "symbols": ["expression$macrocall$2"], "postprocess": id},
    {"name": "expression$macrocall$1$macrocall$6", "symbols": [{"literal":"-"}]},
    {"name": "expression$macrocall$1$macrocall$4$ebnf$1$subexpression$1", "symbols": ["expression$macrocall$1$macrocall$6", "expression$macrocall$1$macrocall$5"]},
    {"name": "expression$macrocall$1$macrocall$4$ebnf$1", "symbols": ["expression$macrocall$1$macrocall$4$ebnf$1$subexpression$1"]},
    {"name": "expression$macrocall$1$macrocall$4$ebnf$1$subexpression$2", "symbols": ["expression$macrocall$1$macrocall$6", "expression$macrocall$1$macrocall$5"]},
    {"name": "expression$macrocall$1$macrocall$4$ebnf$1", "symbols": ["expression$macrocall$1$macrocall$4$ebnf$1", "expression$macrocall$1$macrocall$4$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expression$macrocall$1$macrocall$4", "symbols": ["expression$macrocall$1$macrocall$5", "expression$macrocall$1$macrocall$4$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(item => item[1])]},
    {"name": "expression$macrocall$1", "symbols": ["expression$macrocall$1$macrocall$4"], "postprocess": data => ({ type: "SUB", inputs: flatten(data) })},
    {"name": "expression", "symbols": ["expression$macrocall$1"], "postprocess": id},
    {"name": "full_factor$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "full_factor$macrocall$2"]},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1", "symbols": ["full_factor$macrocall$2", "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "full_factor$macrocall$1$ebnf$1", "symbols": ["full_factor$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "full_factor$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "full_factor$macrocall$1", "symbols": [{"literal":"("}, "full_factor$macrocall$1$ebnf$1", {"literal":")"}], "postprocess":  data => {
            if(data[1] === null) return { type: "PARENTHESES_EXPRESSION", expressions: [] }
            const result = []
            result.push(data[1][0])
            result.push(...data[1][1].map(item => item[0]))
            return { type: "PARENTHESES_EXPRESSION", expressions: result }
        } },
    {"name": "full_factor", "symbols": ["full_factor$macrocall$1"]},
    {"name": "full_factor$macrocall$4", "symbols": ["expression"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$2", "symbols": ["full_factor$macrocall$4"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "full_factor$macrocall$3$ebnf$1$macrocall$2"]},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$2", "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1"], "postprocess":  d => {
            const items = [d[0], ...d[1].map(([_, expr]) => expr)]
            return items
        } },
    {"name": "full_factor$macrocall$3$ebnf$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$1"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "full_factor$macrocall$3", "symbols": [{"literal":"["}, "full_factor$macrocall$3$ebnf$1", {"literal":"]"}], "postprocess":  d => {
            const items = d[1] ?? []
            return { type: "VECTOR", items }
        } },
    {"name": "full_factor", "symbols": ["full_factor$macrocall$3"]},
    {"name": "full_short_multiply$macrocall$2", "symbols": ["full_factor"], "postprocess": id},
    {"name": "full_short_multiply$macrocall$1$ebnf$1", "symbols": ["full_short_multiply$macrocall$2"]},
    {"name": "full_short_multiply$macrocall$1$ebnf$1", "symbols": ["full_short_multiply$macrocall$1$ebnf$1", "full_short_multiply$macrocall$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "full_short_multiply$macrocall$1", "symbols": ["full_short_multiply$macrocall$1$ebnf$1"]},
    {"name": "full_short_multiply", "symbols": ["full_short_multiply$macrocall$1"]},
    {"name": "zig_short_multiply", "symbols": ["number"]},
    {"name": "zig_short_multiply", "symbols": ["variable"]},
    {"name": "zig_short_multiply", "symbols": ["number", "variable"]},
    {"name": "short_multiply$macrocall$2", "symbols": ["full_short_multiply"], "postprocess": id},
    {"name": "short_multiply$macrocall$3", "symbols": ["zig_short_multiply"], "postprocess": id},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1$subexpression$1", "symbols": ["short_multiply$macrocall$2", "short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1", "symbols": ["short_multiply$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "short_multiply$macrocall$1$ebnf$1$subexpression$2", "symbols": ["short_multiply$macrocall$2", "short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1", "symbols": ["short_multiply$macrocall$1$ebnf$1", "short_multiply$macrocall$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "short_multiply$macrocall$1$ebnf$2", "symbols": ["short_multiply$macrocall$2"], "postprocess": id},
    {"name": "short_multiply$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$1$ebnf$1", "short_multiply$macrocall$1$ebnf$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3$subexpression$1", "symbols": ["short_multiply$macrocall$3", "short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3", "symbols": ["short_multiply$macrocall$1$ebnf$3$subexpression$1"]},
    {"name": "short_multiply$macrocall$1$ebnf$3$subexpression$2", "symbols": ["short_multiply$macrocall$3", "short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3", "symbols": ["short_multiply$macrocall$1$ebnf$3", "short_multiply$macrocall$1$ebnf$3$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "short_multiply$macrocall$1$ebnf$4", "symbols": ["short_multiply$macrocall$3"], "postprocess": id},
    {"name": "short_multiply$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$1$ebnf$3", "short_multiply$macrocall$1$ebnf$4"]},
    {"name": "short_multiply", "symbols": ["short_multiply$macrocall$1"], "postprocess":  data =>{
            const result = flatten(data)
            if(result.length === 1) return result[0]
            return {type: "IMP_MUL", inputs: result}
        }},
    {"name": "term$macrocall$2", "symbols": ["short_multiply"], "postprocess": id},
    {"name": "term$macrocall$1", "symbols": ["term$macrocall$2"], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$2", "symbols": ["term$macrocall$2"], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$3", "symbols": [{"literal":"*"}], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["term$macrocall$1$macrocall$3", "term$macrocall$1$macrocall$2"]},
    {"name": "term$macrocall$1$macrocall$1$ebnf$1", "symbols": ["term$macrocall$1$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "term$macrocall$1$macrocall$1$ebnf$1$subexpression$2", "symbols": ["term$macrocall$1$macrocall$3", "term$macrocall$1$macrocall$2"]},
    {"name": "term$macrocall$1$macrocall$1$ebnf$1", "symbols": ["term$macrocall$1$macrocall$1$ebnf$1", "term$macrocall$1$macrocall$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "term$macrocall$1$macrocall$1", "symbols": ["term$macrocall$1$macrocall$2", "term$macrocall$1$macrocall$1$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(item => item[1])]},
    {"name": "term$macrocall$1", "symbols": ["term$macrocall$1$macrocall$1"], "postprocess": data => ({ type: "MUL", inputs: flatten(data) })},
    {"name": "term$macrocall$1$macrocall$5", "symbols": ["term$macrocall$2"], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$6", "symbols": [{"literal":"/"}], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$4$ebnf$1$subexpression$1", "symbols": ["term$macrocall$1$macrocall$6", "term$macrocall$1$macrocall$5"]},
    {"name": "term$macrocall$1$macrocall$4$ebnf$1", "symbols": ["term$macrocall$1$macrocall$4$ebnf$1$subexpression$1"]},
    {"name": "term$macrocall$1$macrocall$4$ebnf$1$subexpression$2", "symbols": ["term$macrocall$1$macrocall$6", "term$macrocall$1$macrocall$5"]},
    {"name": "term$macrocall$1$macrocall$4$ebnf$1", "symbols": ["term$macrocall$1$macrocall$4$ebnf$1", "term$macrocall$1$macrocall$4$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "term$macrocall$1$macrocall$4", "symbols": ["term$macrocall$1$macrocall$5", "term$macrocall$1$macrocall$4$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(item => item[1])]},
    {"name": "term$macrocall$1", "symbols": ["term$macrocall$1$macrocall$4"], "postprocess": data => ({ type: "DIV", inputs: flatten(data) })},
    {"name": "term$macrocall$1$macrocall$8", "symbols": ["term$macrocall$2"], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$9", "symbols": [{"literal":"%"}], "postprocess": id},
    {"name": "term$macrocall$1$macrocall$7$ebnf$1$subexpression$1", "symbols": ["term$macrocall$1$macrocall$9", "term$macrocall$1$macrocall$8"]},
    {"name": "term$macrocall$1$macrocall$7$ebnf$1", "symbols": ["term$macrocall$1$macrocall$7$ebnf$1$subexpression$1"]},
    {"name": "term$macrocall$1$macrocall$7$ebnf$1$subexpression$2", "symbols": ["term$macrocall$1$macrocall$9", "term$macrocall$1$macrocall$8"]},
    {"name": "term$macrocall$1$macrocall$7$ebnf$1", "symbols": ["term$macrocall$1$macrocall$7$ebnf$1", "term$macrocall$1$macrocall$7$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "term$macrocall$1$macrocall$7", "symbols": ["term$macrocall$1$macrocall$8", "term$macrocall$1$macrocall$7$ebnf$1"], "postprocess": data => [data[0], ...data[1].map(item => item[1])]},
    {"name": "term$macrocall$1", "symbols": ["term$macrocall$1$macrocall$7"], "postprocess": data => ({ type: "MOD", inputs: flatten(data) })},
    {"name": "term", "symbols": ["term$macrocall$1"], "postprocess": id},
    {"name": "unary_term", "symbols": ["term"], "postprocess": id},
    {"name": "unary_term$macrocall$2", "symbols": ["term"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$2", "symbols": ["unary_term$macrocall$2"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["unary_term$macrocall$1$macrocall$2"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "unary_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1]
            }
        }
        },
    {"name": "unary_term$macrocall$1$macrocall$1", "symbols": ["unary_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": id},
    {"name": "unary_term$macrocall$1", "symbols": ["unary_term$macrocall$1$macrocall$1"], "postprocess": id},
    {"name": "unary_term", "symbols": ["unary_term$macrocall$1"], "postprocess": id}
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
