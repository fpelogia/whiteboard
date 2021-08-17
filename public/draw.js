/*
 *Author: Frederico José Ribeiro Pelogia
 *Year: 2021
 */
// This file contains functions that fill the canvas with the stored content

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
    noStroke();
    fill(text_el.color);
    textSize(text_el.fs);
    text(text_el.txt, text_el.x1, text_el.y1, text_el.x2, text_el.y2); 
}

function atualizaTexto() {
  texto = caixaTexto.value()
}

function confirmaTexto(){
    if(tool == 'latex'){
        caixaLaTeX.style('display', 'none');
        eq = createSpan("");
        eq.parent('canvasP5');
        eq.style('margin-left', '10px');
        eq.style('margin-top', '10px');
        eq.style('border', '1px solid grey');
        eq.position(0, 0);
        eq.style("font-size","160%");
        // Source: MathJax Examples <https://github.com/mathjax/MathJax-demos-web/blob/master/tex-svg.html.md>
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
        //var input = document.getElementById("latex-box").value.trim();
        //img.style('z-index', '-1');
        there_is_temp_eq = true;
        text_input_status = 3;
    }else{
        caixaTexto.style('display', 'none');
        atualizaTexto();
        texto_tela.push({txt: texto, x1: x1_text, y1: y1_text, x2: x2_text, y2: y2_text, color: currentColor, fs:currFontSize});
        type_of_object.push('t');
        text_input_status = 0;
        drawShapes();
    }
}
