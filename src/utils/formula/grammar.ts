// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
 
    import { v4 as uuidV4 } from 'uuid'
    const flatten = (data: any[]): any[] => {
        const result: any[] = []
        if(Array.isArray(data)){
            for(const item of data){
                result.push(...flatten(item))
            }
        }else{
            result.push(data)
        }
        return result.filter(item => item !== null)
    }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": ["number$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "number$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "number$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "number", "symbols": ["number$ebnf$1", "number$ebnf$2"], "postprocess":  
        d => {
            let text = d[0].join("")
        
            if(d[1] !== null){
                text += "." + d[1][1].join("")
            }
            
            return { type: "NUMBER", value: Number(text), text, id: uuidV4() }
        } 
        },
    {"name": "expression_binary_operator_expression", "symbols": ["unary_term"], "postprocess": id},
    {"name": "expression_binary_operator_expression", "symbols": ["expression_binary_operator_expression", {"literal":"+"}, "unary_term"], "postprocess": data => ({ type: "ADD", inputs: [data[0], data[2]], id: uuidV4()  })},
    {"name": "expression_binary_operator_expression", "symbols": ["expression_binary_operator_expression", {"literal":"-"}, "unary_term"], "postprocess": data => ({ type: "SUB", inputs: [data[0], data[2]], id: uuidV4() })},
    {"name": "term_binary_operator_expression", "symbols": ["short_multiply"], "postprocess": id},
    {"name": "term_binary_operator_expression", "symbols": ["term_binary_operator_expression", {"literal":"*"}, "short_multiply"], "postprocess": data => ({ type: "MUL", inputs: [data[0], data[2]], id: uuidV4() })},
    {"name": "term_binary_operator_expression", "symbols": ["term_binary_operator_expression", {"literal":"/"}, "short_multiply"], "postprocess": data => ({ type: "DIV", inputs: [data[0], data[2]], id: uuidV4() })},
    {"name": "term_binary_operator_expression", "symbols": ["term_binary_operator_expression", {"literal":"%"}, "short_multiply"], "postprocess": data => ({ type: "MOD", inputs: [data[0], data[2]], id: uuidV4() })},
    {"name": "variable$ebnf$1", "symbols": []},
    {"name": "variable$ebnf$1", "symbols": ["variable$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "variable", "symbols": [/[a-zA-Z_]/, "variable$ebnf$1"], "postprocess": data => ({ type: "VARIABLE", name: data[0]+(data[1] ?? []).join(""), id: uuidV4() })},
    {"name": "expression", "symbols": ["expression_binary_operator_expression"], "postprocess": id},
    {"name": "full_factor$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "full_factor$macrocall$2"]},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "full_factor$macrocall$1$ebnf$1$subexpression$1", "symbols": ["full_factor$macrocall$2", "full_factor$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "full_factor$macrocall$1$ebnf$1", "symbols": ["full_factor$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "full_factor$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "full_factor$macrocall$1", "symbols": [{"literal":"("}, "full_factor$macrocall$1$ebnf$1", {"literal":")"}], "postprocess":  (data: any[]): any => {
            if(data[1] === null) return { type: "PARENTHESES_EXPRESSION", expressions: [], id: uuidV4() }
            const result = []
            result.push(data[1][0])
            result.push(...data[1][1].map((item:any[])=> item[1]))
            return { type: "PARENTHESES_EXPRESSION", expressions: result, id: uuidV4() }
        } },
    {"name": "full_factor", "symbols": ["full_factor$macrocall$1"]},
    {"name": "full_factor$macrocall$4", "symbols": ["expression"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$2", "symbols": ["full_factor$macrocall$4"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "full_factor$macrocall$3$ebnf$1$macrocall$2"]},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1", "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "full_factor$macrocall$3$ebnf$1$macrocall$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$2", "full_factor$macrocall$3$ebnf$1$macrocall$1$ebnf$1"], "postprocess":  (d: any[]): any[] => {
            const items = [d[0], ...d[1].map(([_, expr]: any) => expr)]
            return items
        } },
    {"name": "full_factor$macrocall$3$ebnf$1", "symbols": ["full_factor$macrocall$3$ebnf$1$macrocall$1"], "postprocess": id},
    {"name": "full_factor$macrocall$3$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "full_factor$macrocall$3", "symbols": [{"literal":"["}, "full_factor$macrocall$3$ebnf$1", {"literal":"]"}], "postprocess":  (d: any[]): any => {
            const items = d[1] ?? []
            return { type: "VECTOR", items, id: uuidV4() }
        } },
    {"name": "full_factor", "symbols": ["full_factor$macrocall$3"]},
    {"name": "full_short_multiply$macrocall$2", "symbols": ["full_factor"], "postprocess": id},
    {"name": "full_short_multiply$macrocall$1$ebnf$1", "symbols": ["full_short_multiply$macrocall$2"]},
    {"name": "full_short_multiply$macrocall$1$ebnf$1", "symbols": ["full_short_multiply$macrocall$1$ebnf$1", "full_short_multiply$macrocall$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "full_short_multiply$macrocall$1", "symbols": ["full_short_multiply$macrocall$1$ebnf$1"]},
    {"name": "full_short_multiply", "symbols": ["full_short_multiply$macrocall$1"]},
    {"name": "zig_short_multiply", "symbols": ["number"]},
    {"name": "zig_short_multiply", "symbols": ["variable"]},
    {"name": "zig_short_multiply", "symbols": ["number", "variable"]},
    {"name": "zig_short_multiply$macrocall$2", "symbols": ["variable"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$1$ebnf$1", "symbols": [/[xyzw]/]},
    {"name": "zig_short_multiply$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$1$ebnf$1", /[xyzw]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$1", "symbols": ["zig_short_multiply$macrocall$2", {"literal":"."}, "zig_short_multiply$macrocall$1$ebnf$1"], "postprocess":  (d: any[]): any => {
            const items = d[2]
            return { type: "VECTOR_ITEM_SWIZZLE_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$1"]},
    {"name": "zig_short_multiply$macrocall$4$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$2", "symbols": ["zig_short_multiply$macrocall$4$macrocall$2"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1", "symbols": ["zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$2", "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1$ebnf$1"], "postprocess":  (d: any[]): any[] => {
            const items = [d[0], ...d[1].map(([_, expr]: any) => expr)]
            return items
        } },
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$4$macrocall$1$ebnf$1$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "zig_short_multiply$macrocall$4$macrocall$1", "symbols": [{"literal":"["}, "zig_short_multiply$macrocall$4$macrocall$1$ebnf$1", {"literal":"]"}], "postprocess":  (d: any[]): any => {
            const items = d[1] ?? []
            return { type: "VECTOR", items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply$macrocall$4", "symbols": ["zig_short_multiply$macrocall$4$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$3$ebnf$1", "symbols": [/[xyzw]/]},
    {"name": "zig_short_multiply$macrocall$3$ebnf$1", "symbols": ["zig_short_multiply$macrocall$3$ebnf$1", /[xyzw]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$3", "symbols": ["zig_short_multiply$macrocall$4", {"literal":"."}, "zig_short_multiply$macrocall$3$ebnf$1"], "postprocess":  (d: any[]): any => {
            const items = d[2]
            return { type: "VECTOR_ITEM_SWIZZLE_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$3"]},
    {"name": "zig_short_multiply$macrocall$6$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$6$macrocall$2"]},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1", "symbols": ["zig_short_multiply$macrocall$6$macrocall$2", "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$6$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "zig_short_multiply$macrocall$6$macrocall$1", "symbols": [{"literal":"("}, "zig_short_multiply$macrocall$6$macrocall$1$ebnf$1", {"literal":")"}], "postprocess":  (data: any[]): any => {
            if(data[1] === null) return { type: "PARENTHESES_EXPRESSION", expressions: [], id: uuidV4() }
            const result = []
            result.push(data[1][0])
            result.push(...data[1][1].map((item:any[])=> item[1]))
            return { type: "PARENTHESES_EXPRESSION", expressions: result, id: uuidV4() }
        } },
    {"name": "zig_short_multiply$macrocall$6", "symbols": ["zig_short_multiply$macrocall$6$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$5$ebnf$1", "symbols": [/[xyzw]/]},
    {"name": "zig_short_multiply$macrocall$5$ebnf$1", "symbols": ["zig_short_multiply$macrocall$5$ebnf$1", /[xyzw]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$5", "symbols": ["zig_short_multiply$macrocall$6", {"literal":"."}, "zig_short_multiply$macrocall$5$ebnf$1"], "postprocess":  (d: any[]): any => {
            const items = d[2]
            return { type: "VECTOR_ITEM_SWIZZLE_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$5"]},
    {"name": "zig_short_multiply$macrocall$8", "symbols": ["variable"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$9", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$7$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$7$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$9"]},
    {"name": "zig_short_multiply$macrocall$7$ebnf$1", "symbols": ["zig_short_multiply$macrocall$7$ebnf$1", "zig_short_multiply$macrocall$7$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$7", "symbols": ["zig_short_multiply$macrocall$8", {"literal":"{"}, "zig_short_multiply$macrocall$9", "zig_short_multiply$macrocall$7$ebnf$1", {"literal":"}"}], "postprocess":  (d: any[]): any => {
            const items = [d[2], ...d[3].map(([_, expr]: any) => expr)]
            return { type: "VECTOR_ITEM_INDEX_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$7"]},
    {"name": "zig_short_multiply$macrocall$11$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$2", "symbols": ["zig_short_multiply$macrocall$11$macrocall$2"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1", "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1", "symbols": ["zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$2", "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1$ebnf$1"], "postprocess":  (d: any[]): any[] => {
            const items = [d[0], ...d[1].map(([_, expr]: any) => expr)]
            return items
        } },
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$11$macrocall$1$ebnf$1$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "zig_short_multiply$macrocall$11$macrocall$1", "symbols": [{"literal":"["}, "zig_short_multiply$macrocall$11$macrocall$1$ebnf$1", {"literal":"]"}], "postprocess":  (d: any[]): any => {
            const items = d[1] ?? []
            return { type: "VECTOR", items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply$macrocall$11", "symbols": ["zig_short_multiply$macrocall$11$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$12", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$10$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$10$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$12"]},
    {"name": "zig_short_multiply$macrocall$10$ebnf$1", "symbols": ["zig_short_multiply$macrocall$10$ebnf$1", "zig_short_multiply$macrocall$10$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$10", "symbols": ["zig_short_multiply$macrocall$11", {"literal":"{"}, "zig_short_multiply$macrocall$12", "zig_short_multiply$macrocall$10$ebnf$1", {"literal":"}"}], "postprocess":  (d: any[]): any => {
            const items = [d[2], ...d[3].map(([_, expr]: any) => expr)]
            return { type: "VECTOR_ITEM_INDEX_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$10"]},
    {"name": "zig_short_multiply$macrocall$14$macrocall$2", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$14$macrocall$2"]},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1", "symbols": ["zig_short_multiply$macrocall$14$macrocall$2", "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1", "symbols": ["zig_short_multiply$macrocall$14$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "zig_short_multiply$macrocall$14$macrocall$1", "symbols": [{"literal":"("}, "zig_short_multiply$macrocall$14$macrocall$1$ebnf$1", {"literal":")"}], "postprocess":  (data: any[]): any => {
            if(data[1] === null) return { type: "PARENTHESES_EXPRESSION", expressions: [], id: uuidV4() }
            const result = []
            result.push(data[1][0])
            result.push(...data[1][1].map((item:any[])=> item[1]))
            return { type: "PARENTHESES_EXPRESSION", expressions: result, id: uuidV4() }
        } },
    {"name": "zig_short_multiply$macrocall$14", "symbols": ["zig_short_multiply$macrocall$14$macrocall$1"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$15", "symbols": ["expression"], "postprocess": id},
    {"name": "zig_short_multiply$macrocall$13$ebnf$1", "symbols": []},
    {"name": "zig_short_multiply$macrocall$13$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "zig_short_multiply$macrocall$15"]},
    {"name": "zig_short_multiply$macrocall$13$ebnf$1", "symbols": ["zig_short_multiply$macrocall$13$ebnf$1", "zig_short_multiply$macrocall$13$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "zig_short_multiply$macrocall$13", "symbols": ["zig_short_multiply$macrocall$14", {"literal":"{"}, "zig_short_multiply$macrocall$15", "zig_short_multiply$macrocall$13$ebnf$1", {"literal":"}"}], "postprocess":  (d: any[]): any => {
            const items = [d[2], ...d[3].map(([_, expr]: any) => expr)]
            return { type: "VECTOR_ITEM_INDEX_EXTRACTION", vector: d[0], items, id: uuidV4() }
        } },
    {"name": "zig_short_multiply", "symbols": ["zig_short_multiply$macrocall$13"]},
    {"name": "short_multiply$macrocall$2", "symbols": ["full_short_multiply"], "postprocess": id},
    {"name": "short_multiply$macrocall$3", "symbols": ["zig_short_multiply"], "postprocess": id},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1$subexpression$1", "symbols": ["short_multiply$macrocall$2", "short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1", "symbols": ["short_multiply$macrocall$1$ebnf$1$subexpression$1"]},
    {"name": "short_multiply$macrocall$1$ebnf$1$subexpression$2", "symbols": ["short_multiply$macrocall$2", "short_multiply$macrocall$3"]},
    {"name": "short_multiply$macrocall$1$ebnf$1", "symbols": ["short_multiply$macrocall$1$ebnf$1", "short_multiply$macrocall$1$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "short_multiply$macrocall$1$ebnf$2", "symbols": ["short_multiply$macrocall$2"], "postprocess": id},
    {"name": "short_multiply$macrocall$1$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$1$ebnf$1", "short_multiply$macrocall$1$ebnf$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3$subexpression$1", "symbols": ["short_multiply$macrocall$3", "short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3", "symbols": ["short_multiply$macrocall$1$ebnf$3$subexpression$1"]},
    {"name": "short_multiply$macrocall$1$ebnf$3$subexpression$2", "symbols": ["short_multiply$macrocall$3", "short_multiply$macrocall$2"]},
    {"name": "short_multiply$macrocall$1$ebnf$3", "symbols": ["short_multiply$macrocall$1$ebnf$3", "short_multiply$macrocall$1$ebnf$3$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "short_multiply$macrocall$1$ebnf$4", "symbols": ["short_multiply$macrocall$3"], "postprocess": id},
    {"name": "short_multiply$macrocall$1$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "short_multiply$macrocall$1", "symbols": ["short_multiply$macrocall$1$ebnf$3", "short_multiply$macrocall$1$ebnf$4"]},
    {"name": "short_multiply", "symbols": ["short_multiply$macrocall$1"], "postprocess":  data =>{
            const result = flatten(data)
            if(result.length === 1) return result[0]
            return {type: "IMP_MUL", inputs: result, id: uuidV4()}
        }},
    {"name": "term", "symbols": ["term_binary_operator_expression"], "postprocess": id},
    {"name": "unary_term", "symbols": ["term"], "postprocess": id},
    {"name": "unary_term$macrocall$2", "symbols": ["term"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$2", "symbols": ["unary_term$macrocall$2"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$1$macrocall$2", "symbols": ["unary_term$macrocall$1$macrocall$2"], "postprocess": id},
    {"name": "unary_term$macrocall$1$macrocall$1$macrocall$1", "symbols": [{"literal":"-"}, "unary_term$macrocall$1$macrocall$1$macrocall$2"], "postprocess": 
        d => {
            return {
                type: "MINUS_PREFIX_UNARY",
                input: d[1],
                id: uuidV4()
            }
        }
        },
    {"name": "unary_term$macrocall$1$macrocall$1", "symbols": ["unary_term$macrocall$1$macrocall$1$macrocall$1"], "postprocess": id},
    {"name": "unary_term$macrocall$1", "symbols": ["unary_term$macrocall$1$macrocall$1"], "postprocess": id},
    {"name": "unary_term", "symbols": ["unary_term$macrocall$1"], "postprocess": id}
  ],
  ParserStart: "expression",
};

export default grammar;
