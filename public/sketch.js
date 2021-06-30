var canv;
var socket;
var radius;
var fr = 60;
var btn;
var borracha = false;
var retangulo = false;
var savedXSign = 0;
var savedYSign = 0;
var drawing = false;
let temp = [];
let shapes = [];
var lastMouseStatus;
var tools = ["pincel",
             "borracha",
             "retangulo"
];
var ferramenta = "pincel";
var limparBtn;
var range;
var currStrokeWeight = 4;
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
function setup(){
    canv = createCanvas(1360,768);
    canv.parent('canvasP5');
    canv.style('margin-left', '10%');
    canv.style('border', '5px solid');
    radius = 10;
    socket = io.connect('http://localhost:3000');
    socket.on('shapes', newDrawing); 
    limparBtn = select("#limpar");
    limparBtn.mousePressed(limpaTela);
    limparBtn = select("#desfazer");
    limparBtn.mousePressed(undoDrawing);
    range = select("#raio");
    range.changed(changeRadius);
    changeRadius();
    strokeWeight(currStrokeWeight);
}
function undoDrawing(){
    shapes.pop();
}
function changeRadius(){
    currStrokeWeight = range.elt.value;
}

function draw(){
    checkTools();
    lastMouseStatus = mouseInsideCanvas();
    if(!drawing){
        background(255);
        noFill();
        for (let i = 0; i < shapes.length; i++){
            drawShape(shapes[i]);
        }
    }
}

function drawShape(shlist){
  beginShape();
  for (let i = 1; i < shlist.length; i++){
    strokeWeight(shlist[i].sw);
    stroke(shlist[i].color);
    line(shlist[i-1].x, shlist[i-1].y,shlist[i].x, shlist[i].y);
  }
  endShape();
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
    if(retangulo){
        stroke(0);//preto
        noFill();
        rect(recx, recy, mouseX-recx, mouseY-recy);
    }
    if(mouseInsideCanvas() || mouseLeftCanvas()){
        shapes.push(temp);
    }
    temp = []
    circle(mouseX, mouseY, 10);
    drawing = false;
}
function mousePressed(){
    if(retangulo){
        recx = mouseX;
        recy = mouseY;
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

    switch(ferramenta){
        case "pincel":
            stroke(0);//preto
            strokeWeight(currStrokeWeight);
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#000000', sw: currStrokeWeight });
            temp.push({ x: mouseX, y: mouseY , color: '#000000', sw: currStrokeWeight});
            break;
        case "borracha":
            stroke(255);//branco
            strokeWeight(currStrokeWeight);
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#ffffff', sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY , color: '#ffffff',  sw: currStrokeWeight});
            break;    
        case "retangulo":
            break;
   }
    //console.log("Coordenada = ("+mouseX+","+mouseY+")");
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
