let phaseCom=0, phaseMax, phase = 0, loaded=0, frameStart = [], traits = false;
let one=false; function finished () {if (!one) {loaded++; one = true;}}
let two=false; function finished2 () {if (!two) {loaded++; two = true;}}

// LOADING SCREEN
let sketch = function(p) {
    let message1 = "DOUBLE CLICK FOR AUDIO MODE";
    let message2 = 'WAIT 5 SECONDS FOR SILENT MODE';
    let message3 = 'LOADING';
    let ancho = Math.floor(widthW);
    let alto = Math.floor(heightW);
    function setLineDash(list) {
        p.drawingContext.setLineDash(list);
    }
    p.setup = function() {        
        cargando = p.createCanvas(ancho, alto);
        cargando.id('carga');
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER,p.CENTER);
        p.textFont("Courier"), p.textSize(12*pixel), p.noStroke();
        p.clear();
    };
    p.draw = function() {
        p.clear();
        p.translate(ancho/2,alto/2)
        if (loaded < 3) {
            let colorin = color(colors[palette][1])
            if(phase <= 2) {colorin.setAlpha(200)} 
            else if (phase == 3) {colorin.setAlpha(170)} 
            else {colorin.setAlpha(140)}
            p.background(colorin);
            // LOADING ANIMATION SPIRAL
            p.noFill();
            setLineDash([1,2.5])
            p.stroke(colors[palette][2]);
            p.strokeWeight(0.7*pixel);
            let currentAngle = map(phaseCom,0,phaseMax,0,90,true) + (phase-1) * 90;
            let coolor = 2;
            p.beginShape();
            for (let i = 60; i < 420; i++) {
                let radius, angle;
                if (mvtSel == 0) {
                    radius = (10 + i*0.4)*pixel;
                    angle = 2*i;
                    leng = 15*pixel;
                } else if (mvtSel == 1) {
                    radius = (100)*pixel+sin(10*(i))*20*pixel;
                    angle = i;
                    leng = 20*pixel;
                } else {
                    radius = Math.round((100)*pixel+sin(4*(i))*50*pixel);
                    angle = i;
                    leng = 20*pixel;
                }
                let x = radius * cos(angle);
                let y = radius * sin(angle);
                let x2 = (leng+radius) * cos(angle);
                let y2 = (leng+radius) * sin(angle);
                if(i<currentAngle+60){
                    p.push();
                    p.strokeWeight(1.2*pixel);
                    p.stroke(colors[palette][coolor]);
                    p.line(x,y,x2,y2)
                    p.pop();
                    coolor++
                    if (coolor == 8) { coolor = 2}
                }
                p.vertex(x, y);
            }
            p.endShape();
            p.noStroke();
            // LOADING LABEL
            p.fill(colors[palette][2]);
            p.rect(0,0,p.textWidth(message3)+5*pixel,15*pixel)
            p.fill(colors[palette][1]);
            p.text(message3,0,0);
        }
        if (loaded == 3) {
            // SOUND LENGTH
            p.fill(colors[palette][2]);
            p.rect(0,-8*pixel,p.textWidth(message1)+5*pixel,15*pixel)
            p.rect(0,8*pixel,p.textWidth(message2)+5*pixel,15*pixel)
            p.fill(colors[palette][1]);
            p.text(message1,0,-8*pixel);
            p.text(message2,0,8*pixel);
        }
    };
};
