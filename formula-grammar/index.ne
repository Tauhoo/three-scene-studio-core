number -> [0-9]:* {% id %}
expression -> number "+" number {% 
    ([first, , second]) => ({ type: "addition", left: first, right: second }) 
%}