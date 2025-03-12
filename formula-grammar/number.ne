number -> [0-9]:+ ("." [0-9]:+):? {% 
    data => {
        let text = data[0].join("")

        if(data[1] !== null){
            text += "." + data[1][1].join("")
        }
        
        return { type: "NUMBER", value: Number(text), text }
    } 
%}