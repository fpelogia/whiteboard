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
    canv = createCanvas(800,600);
    canv.parent('canvasP5');
    canv.style('margin-left', '25%');
    canv.style('border', '5px solid');
    radius = 10;
    socket = io.connect('http://localhost:3000');
    socket.on('mouse', newDrawing); 

    strokeWeight(4);
    limparBtn = select("#limpar");
    limparBtn.mousePressed(limpaTela);
    limparBtn = select("#desfazer");
    limparBtn.mousePressed(undoDrawing);
    range = select("#raio");
    range.changed(changeRadius);
}
function undoDrawing(){
    shapes.pop();
}
function changeRadius(){
    strokeWeight(range.elt.value);
}

function draw(){
    checkTools();
    lastMouseStatus = mouseInsideCanvas();
    if(!drawing){
        background(255);
    }
    noFill();
    for (let i = 0; i < shapes.length; i++){
        drawShape(shapes[i]);
    }
}

function drawShape(shlist){
  beginShape();
  for (let i = 1; i < shlist.length; i++){
    //fill(shlist[i].color);
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
    if(!data.borracha){
        stroke(200,0,0);
    }else if(data.retangulo){

    }else{
        stroke(255);
    }
    line(data.x, data.y, data.px, data.py);
}

function limpaTela(){
    temp = [];
    shapes = [];
}

function ativaBorracha(){
    borracha = true;
    retangulo = false;
}

function ativaRetangulo(){
    retangulo = true;
}

function ativaPincel(){
    borracha = false;
    retangulo = false;
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
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#000000'});
            temp.push({ x: mouseX, y: mouseY , color: '#000000'});
            break;
        case "borracha":
            stroke(255);//branco
            //strokeWeight(15);
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#ffffff'});
            temp.push({ x: mouseX, y: mouseY , color: '#ffffff'});
            break;    
        case "retangulo":
            break;
   }
    //console.log("Coordenada = ("+mouseX+","+mouseY+")");
    var data = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        ferramenta: ferramenta
    }
    socket.emit('mouse', data);
}
function keyPressed(){
  if(keyCode == 32){
      undoDrawing();
  }
}
