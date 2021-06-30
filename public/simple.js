let drawing = false;
let temp = []
let shapes = []
function setup() {
  createCanvas(400, 400);
  strokeWeight(4);
  
}
function drawShape(shlist){
  beginShape();
  for (let i = 1; i < shlist.length; i++)
    line(shlist[i-1].x, shlist[i-1].y,shlist[i].x, shlist[i].y);
  endShape();
}

function draw() {
  if(!drawing){
    background(255);
  }
  noFill();
  for (let i = 0; i < shapes.length; i++){
    drawShape(shapes[i]);
  }
}

function mouseDragged(){
  drawing = true;
  line(pmouseX, pmouseY, mouseX, mouseY);
  temp.push({ x: pmouseX, y: pmouseY });
  temp.push({ x: mouseX, y: mouseY });
  
  
}
function mouseReleased(){
  //endShape();
  //shapes.push()
  shapes.push(temp);
  temp = []
  circle(mouseX, mouseY, 10);
  drawing = false;
}
function keyPressed(){
  if(keyCode == 32){
    shapes.pop();
  }
}

