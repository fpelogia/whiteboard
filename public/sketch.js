var canv;
var socket;
var fr = 60;
var drawing = false;
let temp = [];
let shapes = [];
var lastMouseStatus;
var tools = ["pincel",
             "borracha",
             "reta",
             "retangulo",
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
var currentColor;

function setup(){
    canv = createCanvas(1360,768);
    canv.parent('canvasP5');
    canv.style('margin-left', '10%');
    canv.style('border', '5px solid');
    //conexão com
    socket = io.connect('http://localhost:3000');
    socket.on('shapes', newDrawing); 
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

    strokeWeight(currStrokeWeight);
    background(255); // pinta o fundo de branco
}

function draw(){
    checkTools();
    lastMouseStatus = mouseInsideCanvas();
}

function checkTools(){
    var btn;
    for (let i = 0; i< tools.length; i++){
        btn = select("#"+tools[i]);
        //console.log("ferramenta", tools[i] , " : ", btn.elt.checked);
        if(btn.elt.checked){
            ferramenta = tools[i];
        }
    }
}
function undoDrawing(){
    shapes.pop();
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
    noFill();
    for (let i = 0; i < shapes.length; i++){
        drawShape(shapes[i]);
    }
}
function mouseInsideCanvas(){
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height ){
        return true;
    }else{
        return false;
    }
}

function newDrawing(data){
    shapes = data.shapes;
    shapes.push(data.temp);
}

function limpaTela(){
    temp = [];
    shapes = [];
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
        case "reta":
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            break;
        default:
            break;
    }

    if(mouseInsideCanvas() || mouseLeftCanvas()){
        shapes.push(temp);
    }

    temp = []
    background(255);
    drawShapes();
}
function mousePressed(){
    if(ferramenta == "retangulo" || ferramenta == "reta"){
        savedX = mouseX;
        savedY = mouseY;
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
            stroke(currentColor);
            rect(savedX, savedY, mouseX - savedX, mouseY - savedY);
            // apenas para visualização. armazenamento é feito no mouseReleased
            break;
        case "reta":
            background(255);
            drawShapes();
            noFill()
            stroke(currentColor);
            line(savedX, savedY, mouseX, mouseY);
            // apenas para visualização. armazenamento é feito no mouseReleased
            break;
        default:
            break;
   }

    var data = {
        shapes: shapes,
        temp: temp
    }
    socket.emit('shapes', data);
}

function keyPressed(){
  if(keyCode == 32){
      undoDrawing();
  }
}
