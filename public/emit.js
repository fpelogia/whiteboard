// ========== Sending Information ==========
function emitDrawing(){

   var data = {
       shapes: shapes,
       temp: temp,
       texto_tela: texto_tela,
       lista_circ: lista_circ,
       too : type_of_object
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

// ========== Recieving Information ==========

function newDrawing(data){
    type_of_object = data.too;
    texto_tela = data.texto_tela;
    lista_circ = data.lista_circ;
    shapes = data.shapes;
    if(temp.length != 0){
        shapes.push(data.temp);
    }
    drawShapes();
}

function newEquation(data){

    // Source: MathJax Examples <https://github.com/mathjax/MathJax-demos-web/blob/master/tex-svg.html.md>
    
    var input = data.cmd;
    eq = createSpan("");
    eq.parent('canvasP5');
    eq.style('margin-left', '10px');
    //eq.style('z-index', '-1');
    eq.style('margin-top', '10px');
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
    //type_of_object.push('e');
    type_of_object = data.too;
}
