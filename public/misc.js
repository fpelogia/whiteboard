/*
 *Author: Frederico José Ribeiro Pelogia
 *Year: 2021
 */
//This file contains auxiliary functions to deal with the canvas an tool updates

// Checks tool selection by name
function checkTools(){
    var btn;
    for (let i = 0; i< tools.length; i++){
        btn = select("#"+tools[i]);
        if(btn.elt.checked){
            if(tool != tools[i] && text_input_status >= 2){
                // Tool changed before finished writing text or TeX
                switch(text_input_status){
                    case 2:
                        confirmaTexto();
                        break;
                    case 3:
                        eq.elt.remove();// Discard unpositioned equation
                        text_input_status = 0;
                        break;
                }
            }
            tool = tools[i];
        }
    }
}

function undoDrawing(){
    var ch = type_of_object.pop();
    if(ch == 't'){
        console.log("Text removed");
        texto_tela.pop();
    }else if(ch == 's'){
        console.log("Shape removed");
        shapes.pop();
    }else if(ch == 'e'){
        console.log("Equation removed")
        var ult_eq = lista_eqs.pop();
        ult_eq.elt.remove();
        emitRemEq(1); // Tells the other users that an Equation was popped
    }else if(ch == 'c'){
        console.log("circle removed")
        lista_circ.pop();
    }
    emitDrawing(); // Send message to other users
}

// Remove all elements from canvas
function limpaTela(){
    temp = [];
    shapes = [];
    texto_tela = [];
    lista_circ = [];
    for (let i = 0; i < lista_eqs.length; i++){
        lista_eqs[i].elt.remove();
    }
    lista_eqs = [];
    emitRemEq(-1);// Tells the other users that the screen was cleaned
    emitDrawing();// Send message to other users

}

function mouseInsideCanvas(){
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ){
        return true;
    }else{
        return false;
    }
}

function mouseLeftCanvas(){
    if(mouseIsPressed && mouseInsideCanvas != lastMouseStatus && !mouseInsideCanvas()){
        lastMouseStatus = mouseInsideCanvas();
        return true;
    }else{
        return false;
    }
}

// Update tool information

function changeLineWidth(){
    currStrokeWeight = lwSlider.elt.value;
}

function changeFontSize(){
    currFontSize = parseInt(fontSizeInp.elt.value) + 12;
    caixaTexto.style("font-size", fontSizeInp.elt.value + 'pt');
}

function changeColor(){
    currentColor = seletorCor.elt.value;
    console.log(currentColor);
}

