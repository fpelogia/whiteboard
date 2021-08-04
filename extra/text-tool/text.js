var x1 = 50;
var y1 = 50;
var x2 = 350;
var y2 = 350;
var texto = "";

function setup() {
  createCanvas(400, 400);
  let inp = createInput('');
  inp.position(0,0);
  inp.size(200, 50);
  inp.input(myInputEvent);
  background(220);
}

function myInputEvent() {
  console.log(this.value());
  background(220);
  fill(0);
  textSize(16);
  texto = this.value()
  text(texto, x1,y1, x2, y2); 
}

function draw() {
    
}

function mousePressed(){
  background(220);
  x1 = mouseX;
  y1 = mouseY;
}

function mouseDragged(){
  background(220); 
  noFill();
  rect(x1,y1, mouseX - x1, mouseY - y1);
  x2 = mouseX - x1;
  y2 = mouseY - y1;
  fill(0);
  textSize(28);
  text(texto, x1,y1, x2, y2); 
  
}
