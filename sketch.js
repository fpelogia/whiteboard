/*
 *Author: Frederico José Ribeiro Pelogia
 *Year: 2021
 */
var canv;
var socket;
var drawing = false;
let temp = [];
let temp_texto = [];
let temp_eq = [];
let shapes = [];
let texto_tela = [];
let type_of_object = [];
var lastMouseStatus;
var tools = ["paint-brush",
             "eraser",
             "line-tool",
             "rectangle",
             "circ",
             "text-tool",
             "latex",
];
var tool = "paint-brush"; //current tool
var lwSlider;
var seletorCor;
var caixaTexto;
var caixaLaTeX;
var limparBtn;
var fontSizeInp;
var currStrokeWeight = 4;
var savedX;
var savedY;
var currentColor;
var x1_text = 0;
var y1_text = 0;
var x2_text = 0;
var y2_text = 0;
var texto = "";
var there_is_temp_eq = false;
var text_input_status = 0;
var img;
var eq;
var lista_eqs = [];
var lista_circ = [];
var rec_lista_eqs = [];
var last_latex_cmd;
var imx;
var imy;

function setup(){
    // Canvas setup
    canv = createCanvas(1360,768);
    canv.parent('canvasP5');
    canv.style('margin', '0px');
    canv.style('border', '5px solid');
    // Server connection and message handling
    socket = io();
    socket.on('data', newDrawing); 
    socket.on('equation', newEquation); 
    socket.on('eq-rm', newRemovedEq); 
    // Action buttons
    limparBtn = select("#limpar");
    limparBtn.mousePressed(limpaTela);
    limparBtn = select("#desfazer");
    limparBtn.mousePressed(undoDrawing);
    // Line Width Selector
    lwSlider = select("#lw-slider");
    lwSlider.changed(changeLineWidth);
    changeLineWidth();
    // Color Selector
    seletorCor = select('#cor');
    seletorCor.changed(changeColor);
    changeColor();
    // Text Box
    caixaTexto = select('#text-box');
    // TeX Box
    caixaLaTeX = select('#latex-box');
    // Font Size Selector
    fontSizeInp = select('#font-size');
    fontSizeInp.changed(changeFontSize);
    changeFontSize();

    strokeWeight(currStrokeWeight);
    background(255); // White Background
}

// Main Loop of the project
function draw(){
    if(there_is_temp_eq && mouseInsideCanvas()){
        imx = mouseX;
        imy = mouseY;
        eq.position(imx, imy);
    }
    checkTools();
    lastMouseStatus = mouseInsideCanvas();
}

function keyPressed(){
  if(keyCode == ENTER){
    confirmaTexto(); // For both Text and TeX
    emitDrawing();
  }
}

function mousePressed(){
    if(tool == "rectangle" || tool == "line-tool" || tool == "circ"){
        savedX = mouseX;
        savedY = mouseY;
    }
    if(tool == "text-tool" && mouseInsideCanvas() && text_input_status != 2){
        x1_text = mouseX;
        y1_text = mouseY;
        if(text_input_status == 0){
            caixaTexto.style('display', 'block');
            text_input_status = 1;
        }
    }
    if(tool == "latex" && mouseInsideCanvas() && text_input_status < 2){
        x1_text = mouseX;
        y1_text = mouseY;
        if(text_input_status == 0){
            caixaLaTeX.style('display', 'block');
            text_input_status = 1;
        }
    }
}

function mouseDragged(){
    drawing = true;
    strokeWeight(currStrokeWeight);
    switch(tool){
        case "paint-brush":
            stroke(currentColor);
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY , color: currentColor, sw: currStrokeWeight});
            break;
        case "eraser":
            stroke(255);// White 
            line(pmouseX, pmouseY, mouseX, mouseY);
            temp.push({ x: pmouseX, y: pmouseY, color: '#ffffff', sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY , color: '#ffffff',  sw: currStrokeWeight});
            break;    
        case "rectangle":
            background(255);
            drawShapes();
            noFill()
            strokeWeight(currStrokeWeight);
            stroke(currentColor);
            rect(savedX, savedY, mouseX - savedX, mouseY - savedY);// Just for user preview...
            break;
        case "circ":
            background(255);
            drawShapes();
            noFill()
            strokeWeight(currStrokeWeight);
            stroke(currentColor);
            circle(savedX,savedY,sqrt((mouseX - savedX)**2 + (mouseY - savedY)**2));// Just for user preview...
            break;
        case "line-tool":
            background(255);
            drawShapes();
            noFill()
            stroke(currentColor);
            strokeWeight(currStrokeWeight);
            line(savedX, savedY, mouseX, mouseY);// Just for user preview...
            break;
        case "text-tool":
            if(text_input_status != 1){
                break;
            }
            caixaTexto.position(x1_text + 10, y1_text + 10);
            caixaTexto.style('width', mouseX - x1_text  + 'px');
            caixaTexto.style('height', mouseY - (y1_text ) + 'px');

            caixaTexto.style("color", currentColor);
            caixaTexto.style("background", "transparent");
            caixaTexto.style("border-radius", "15px");

            x2_text = mouseX - x1_text;
            y2_text = mouseY - y1_text;
            break;
        case "latex":
            if(text_input_status != 1){
                break;
            }
            caixaLaTeX.position(x1_text + 10, y1_text + 10);
            caixaLaTeX.style('width', mouseX - x1_text  + 'px');
            caixaLaTeX.style('height', mouseY - (y1_text ) + 'px');
            x2_text = mouseX;
            y2_text = mouseY - y1_text;
            break;
        default:
            break;
   }
   emitDrawing(); // Send message to other users
}

function mouseReleased(){
    switch(tool){
        case "rectangle":
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: savedX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            break;
        case "circ":
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
        case "line-tool":
            temp.push({ x: savedX, y: savedY, color: currentColor, sw: currStrokeWeight});
            temp.push({ x: mouseX, y: mouseY, color: currentColor, sw: currStrokeWeight});
            break;
        case "text-tool":
            if(text_input_status != 1){
                break;
            }
            text_input_status = 2;
            break;
        case "latex":
            if(mouseInsideCanvas() == 0) 
                break;
            if(text_input_status == 3){
                eq.style('border', 'none');
                text_input_status = 0;
                lista_eqs.push(eq);
                type_of_object.push('e');
                emitEquation();
            }
            there_is_temp_eq = false;
            if(text_input_status != 1){
                break;
            }
            text_input_status = 2;
            break;
        default:
            break;
    }

    if(mouseInsideCanvas() && tool != "latex" && tool != "text-tool" && tool != "circ" ){
        shapes.push(temp);
        type_of_object.push('s');
    }

    temp = []
    background(255);
    drawShapes();
    emitDrawing();
}
