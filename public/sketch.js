var canv;
var socket;
var fr = 60;
var drawing = false;
let temp = [];
let temp_texto = [];
let temp_eq = [];
let shapes = [];
let texto_tela = [];
let type_of_object = [];
var lastMouseStatus;
var tools = ["pincel",
             "borracha",
             "reta",
             "retangulo",
             "circulo",
             "texto",
             "latex",
];
var ferramenta = "pincel";
var limparBtn;
var range;
var currStrokeWeight = 4;
var savedX;
var savedY;
var seletorCor;
var caixaTexto;
var caixaLaTeX;
var currentColor;
var x1_text = 0;
var y1_text = 0;
var x2_text = 0;
var y2_text = 0;
var texto = "";
var output;
var there_is_temp_eq = false;
var is_creating_text_box = 0;
var img;
var eq;
var lista_eqs = [];
var lista_circ = [];
var rec_lista_eqs = [];
var last_latex_cmd;
var imx;
var imy;

function setup(){
    canv = createCanvas(1360,768);
    canv.parent('canvasP5');
    canv.style('margin', '0px');
    canv.style('border', '5px solid');
    //conexão com
    socket = io.connect('http://localhost:3000');
    socket.on('data', newDrawing); 
    socket.on('equation', newEquation); 
    //botão de limpar tela
    limparBtn = select("#limpar");
    limparBtn.mousePressed(limpaTela);
    limparBtn = select("#desfazer");
    limparBtn.mousePressed(undoDrawing);
    // seletor de espessura
    range = select("#raio");
    range.changed(changeRadius);
    changeRadius();
    //seletor de cor
    seletorCor = select('#cor');
    seletorCor.changed(changeColor);
    changeColor();
    //caixa de texto
    caixaTexto = select('#caixa_texto');
    //caixa para inserção dos comandos LaTeX
    caixaLaTeX = select('#caixa_latex');
    //caixaTexto.input(atualizaTexto);

    output = select('#output');

    strokeWeight(currStrokeWeight);
    background(255); // pinta o fundo de branco
}
function draw(){

    if(there_is_temp_eq && mouseInsideCanvas()){
        imx = mouseX;
        imy = mouseY;
        eq.position(imx, imy);
    }
    checkTools();
    lastMouseStatus = mouseInsideCanvas();
}

function checkTools(){
    var btn;
    for (let i = 0; i< tools.length; i++){
        btn = select("#"+tools[i]);
        //console.log("ferramenta", tools[i] , " : ", btn.elt.checked);
        if(btn.elt.checked){
            if(ferramenta != tools[i] && is_creating_text_box >= 2){
                switch(is_creating_text_box){
                    case 2:
                        confirmaTexto();
                        break;
                    case 3:
                        eq.elt.remove();
                        is_creating_text_box = 0;
                        break;
                }
            }
            ferramenta = tools[i];
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
    }else if(ch == 'c'){
        console.log("circle removed")
        lista_circ.pop();
    }
    emitDrawing();
}
function changeRadius(){
    currStrokeWeight = range.elt.value;
}
function changeColor(){
    currentColor = seletorCor.elt.value;
    console.log(currentColor);
}

function drawShape(shlist){
    noFill();
    strokeJoin(ROUND);
    beginShape();
    for (let i = 1; i < shlist.length; i++){
    strokeWeight(shlist[i].sw);
    stroke(shlist[i].color);
    line(shlist[i-1].x, shlist[i-1].y,shlist[i].x, shlist[i].y);
    vertex(shlist[i-1].x, shlist[i-1].y);
    vertex(shlist[i].x, shlist[i].y);
    }
    endShape();
}
function drawShapes(){
    background(255);
    desenhaCirculos();
    strokeWeight(1);
    escreveTextos();
    noFill();
    for (let i = 0; i < shapes.length; i++){
        drawShape(shapes[i]);
    }
}
function desenhaCirculos(){
    for (let i = 0; i < lista_circ.length; i++){
        desenhaCirculo(lista_circ[i]);
    }
}

function desenhaCirculo(c){
    noFill();
    strokeWeight(c.sw);
    stroke(c.color);
    circle(c.cx, c.cy, c.r);        
}

function escreveTextos(){
    for (let i = 0; i < texto_tela.length; i++){
        escreveTexto(texto_tela[i]);
    }
}
function escreveTexto(text_el){
    textAlign(LEFT, TOP);
    //stroke(text_el.color);
    noStroke();
    fill(text_el.color);
    textSize(36);
    text(text_el.txt, text_el.x1, text_el.y1, text_el.x2, text_el.y2); 
}



function mouseInsideCanvas(){
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ){
        return true;
    }else{
        return false;
    }
}

function newDrawing(data){
    texto_tela = data.texto_tela;
    lista_circ = data.lista_circ;
    shapes = data.shapes;
    shapes.push(data.temp);
    drawShapes();
}

function newEquation(data){

    var input = data.cmd;
    eq = createSpan("");
    eq.parent('canvasP5');
    eq.style('margin-left', '500px');
    //eq.style('z-index', '-1');
    eq.style('margin-top', '120px');
    eq.position(0, 0);
    eq.style("font-size","160%");
    MathJax.texReset();
    var opts = MathJax.getMetricsFor(eq.elt);
    last_latex_cmd = input;
    MathJax.tex2svgPromise(input, opts).then(function (node) {
      //
      //  The promise returns the typeset node, which we add to the output
      //  Then update the document to include the adjusted CSS for the
      //    content of the new equation.
      //
      eq.elt.appendChild(node);
      MathJax.startup.document.clear();
      MathJax.startup.document.updateDocument();
    }).catch(function (err) {
      //
      //  If there was an error, put the message into the output instead
      //
      eq.elt.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
    }).then(function () {
      //
      //  Error or not, re-enable the display and render buttons
      //
      //button.disabled = display.disabled = false;
    });
    //var input = document.getElementById("caixa_latex").value.trim();
    //img.style('z-index', '-1');
    //

    eq.position(data.x, data.y);
    lista_eqs.push(eq);
    type_of_object.push('e');
}

function limpaTela(){
    temp = [];
    shapes = [];
    texto_tela = [];
    emitDrawing();
}

function atualizaTexto() {
  //console.log(this.value());
  //background(200);
    //
  textAlign(LEFT, TOP);
  fill(currentColor);
  textSize(36);
  texto = caixaTexto.value()
  //text(texto, x1_text, y1_text, x2_text, y2_text); 
}

function confirmaTexto(){
    if(ferramenta == 'latex'){
        caixaLaTeX.style('display', 'none');
        eq = createSpan("");
        eq.parent('canvasP5');
        eq.style('margin-left', '500px');
        //eq.style('z-index', '-1');
        eq.style('margin-top', '120px');
        eq.style('border', '1px solid grey');
        eq.position(0, 0);
        eq.style("font-size","160%");
        MathJax.texReset();
        var input = caixaLaTeX.elt.value.trim();
        var opts = MathJax.getMetricsFor(eq.elt);
        last_latex_cmd = input;
        MathJax.tex2svgPromise(input, opts).then(function (node) {
          //
          //  The promise returns the typeset node, which we add to the output
          //  Then update the document to include the adjusted CSS for the
          //    content of the new equation.
          //
          eq.elt.appendChild(node);
          MathJax.startup.document.clear();
          MathJax.startup.document.updateDocument();
        }).catch(function (err) {
          //
          //  If there was an error, put the message into the output instead
          //
          eq.elt.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
        }).then(function () {
          //
          //  Error or not, re-enable the display and render buttons
          //
          //button.disabled = display.disabled = false;
        });
        //var input = document.getElementById("caixa_latex").value.trim();
        //img.style('z-index', '-1');
        there_is_temp_eq = true;
        is_creating_text_box = 3;
    }else{
        caixaTexto.style('display', 'none');
        atualizaTexto();
        texto_tela.push({txt: texto, x1: x1_text, y1: y1_text, x2: x2_text, y2: y2_text, color: currentColor});
        type_of_object.push('t');
        is_creating_text_box = 0;
        drawShapes();
    }
}

function mouseReleased(){
    switch(ferramenta){
        case "retangulo":
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: savedX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            break;
        case "circulo":
            if(!mouseInsideCanvas()) break;
            lista_circ.push({ 
                cx: savedX, 
                cy: savedY, 
                r:sqrt((mouseX - savedX)**2 + (mouseY - savedY)**2),
                color:currentColor,
                sw: currStrokeWeight
            });             
            type_of_object.push('c');
            break;
        case "reta":
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            break;
        case "texto":
            if(is_creating_text_box != 1){
                break;
            }
            is_creating_text_box = 2;
            break;
        case "latex":
            if(mouseInsideCanvas() == 0) 
                break;
            if(is_creating_text_box == 3){
                eq.style('border', 'none');
                is_creating_text_box = 0;
                lista_eqs.push(eq);
                type_of_object.push('e');
                emitEquation();
            }
            there_is_temp_eq = false;
            if(is_creating_text_box != 1){
                break;
            }
            is_creating_text_box = 2;
            break;
        default:
            break;
    }

    //if(mouseInsideCanvas() || mouseLeftCanvas()){
    if(mouseInsideCanvas() && ferramenta != "latex" && ferramenta != "texto" && ferramenta != "circulo" ){
        shapes.push(temp);
        console.log("opa... novo shape : ", ferramenta);
        type_of_object.push('s');
    }

    temp = []
    background(255);
    drawShapes();
    emitDrawing();
}
function mousePressed(){
    if(ferramenta == "retangulo" || ferramenta == "reta" || ferramenta == "circulo"){
        savedX = mouseX;
        savedY = mouseY;
    }
    if(ferramenta == "texto" && mouseInsideCanvas() && is_creating_text_box != 2){
        x1_text = mouseX;
        y1_text = mouseY;
        if(is_creating_text_box == 0){
            caixaTexto.style('display', 'block');
            is_creating_text_box = 1;
        }
    }
    if(ferramenta == "latex" && mouseInsideCanvas() && is_creating_text_box < 2){
        x1_text = mouseX;
        y1_text = mouseY;
        if(is_creating_text_box == 0){
            caixaLaTeX.style('display', 'block');
            is_creating_text_box = 1;
        }
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

function mouseDragged(){
    drawing = true;
    strokeWeight(currStrokeWeight);
    switch(ferramenta){
        case "pincel":
            stroke(currentColor);
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY , color: currentColor, sw: currStrokeWeight});
            break;
        case "borracha":
            stroke(255);//branco
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#ffffff', sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY , color: '#ffffff',  sw: currStrokeWeight});
            break;    
        case "retangulo":
            background(255);
            drawShapes();
            noFill()
            strokeWeight(currStrokeWeight);
            stroke(currentColor);
            rect(savedX, savedY, mouseX - savedX, mouseY - savedY);
            // apenas para visualização. armazenamento é feito no mouseReleased
            break;
        case "circulo":
            background(255);
            drawShapes();
            noFill()
            strokeWeight(currStrokeWeight);
            stroke(currentColor);
            circle(savedX,savedY,sqrt((mouseX - savedX)**2 + (mouseY - savedY)**2));             
            // apenas para visualização. armazenamento é feito no mouseReleased
            break;
        case "reta":
            background(255);
            drawShapes();
            noFill()
            stroke(currentColor);
            strokeWeight(currStrokeWeight);
            line(savedX, savedY, mouseX, mouseY);
            // apenas para visualização. armazenamento é feito no mouseReleased
            break;
        case "texto":
            if(is_creating_text_box != 1){
                break;
            }
            caixaTexto.position(x1_text + 500, y1_text + 120);
            caixaTexto.style('width', mouseX - x1_text  + 'px');
            caixaTexto.style('height', mouseY - (y1_text ) + 'px');

            caixaTexto.style("color", currentColor);
            caixaTexto.style("background", "transparent");
            caixaTexto.style("border-radius", "15px");

            x2_text = mouseX - x1_text;
            y2_text = mouseY - y1_text;
            break;
        case "latex":
            if(is_creating_text_box != 1){
                break;
            }
            caixaLaTeX.position(x1_text + 500, y1_text + 120);
            caixaLaTeX.style('width', mouseX - x1_text  + 'px');
            caixaLaTeX.style('height', mouseY - (y1_text ) + 'px');
            x2_text = mouseX;
            y2_text = mouseY - y1_text;
            break;
        default:
            break;
   }

   emitDrawing();

}

function emitDrawing(){

   var data = {
       shapes: shapes,
       temp: temp,
       texto_tela: texto_tela,
       lista_circ: lista_circ
   }
   socket.emit('data', data);
}

function emitEquation(){

   var data = {
       cmd: last_latex_cmd,
       x: imx,
       y: imy
   }
   socket.emit('equation', data);
}


function keyPressed(){
  if(keyCode == ENTER){
    confirmaTexto();
    emitDrawing();
  }
}

