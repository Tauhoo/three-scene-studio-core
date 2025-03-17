number -> [0-9]:+ ("." [0-9]:+):? {% 
    d => {
        let text = d[0].join("")

        if(d[1] !== null){
            text += "." + d[1][1].join("")
        }
        
        return { type: "NUMBER", value: Number(text), text }
    } 
%}