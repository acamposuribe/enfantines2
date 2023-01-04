// BRUSHES
class LineStyle {
    constructor (type) {
        this.type = type;
        switch (this.type) { // Global Parameters for the brushes
            case "pen":
                // weight, vibration, definition, quality, opacity, step_length
                this.params = [1,0.3,0.5,5,230,0.4]
            break;
            case "rotring":
                this.params = [1,0.1,0.8,15,200,0.6]
            break;
            case "2B":
                this.params = [0.7,1.5,0.3,10,255,0.4]
            break;
            case "HB":
                this.params = [0.55,0.9,0.5,4,210,0.4]
            break;
            case "2H":
                this.params = [0.7,0.6,0.5,1,170,0.4]
            break;
            case "cpencil":
                this.params = [1,1,0.9,10,120,0.3]
            break;
            case "charcoal":
                this.params = [1.5,4,0.85,2,150,0.1]
            break;
            case "marker":
                this.params = [5,0.5,0.5,4,60,1]
                this.marker = true;
            break;
            case "spray":
                this.params = [0.5,20,0.5,50,190,2]
                this.spray = true;
            break;
        }      
        this.weight = this.params[0]*pixel, this.vibration = this.params[1], this.def = this.params[2], this.quality = this.params[3], this.opacity = this.params[4], this.step_length = this.params[5];         
    }
    brushvariation () {
        switch (this.type) {
            case "pen":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.3,0.8,rand(3.5,5)];
            break;
            case "rotring":
                this.param = [rand(0.45,0.55),rand(0.7,0.8),1.1,0.9,rand(3.5,5)];
            break;
            case "2H": case "2B": case "HB":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.3,0.8,rand(3.5,5)];
            break;
            case "cpencil":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.2,0.9,rand(3.5,5)];
            break;
            case "charcoal":
                this.param = [rand(0.35,0.65),rand(0.7,0.8),1.3,0.8,rand(3.5,5)];
            break;
            case "marker":
                this.param = [rand(0.45,0.55),rand(0.85,0.9),1,0.75,rand(3,6)];
            break;
            case "spray":
                this.param = [rand(0.45,0.55),rand(0.85,0.9),0.3,1.2,rand(5,7)];
            break;
        }
        this.a = this.param[0], this.b = this.param[1], this.m1 = this.param[2], this.m2 = this.param[3], this.c = this.param[4];
        
        this.adj = 1,this.adj2=1; 
        stroke(this.tono), fill(this.tono);
        if (this.marker) {
            this.adj = this.scale, this.adj2 = 0.9*this.scale;
            this.randMark = rand(0.1,0.3), this.randMark2 = rand(0.7,0.9);
        } else {noStroke();}
    }
    plot (_plot,_x,_y,_tono,_scale) { 
        push();
        this.scale = _scale, this.tono = color(_tono), this.distance = 0, this.tono.setAlpha(this.opacity);
        this.brushvariation();
        // GEOMETRY PARAMS
        this.x = _x + _plot.adjust[0]*pixel, this.y = _y + _plot.adjust[1]*pixel, this.length = _plot.length, this.linepoint = new Pos(this.x,this.y);
        this.step = this.step_length/this.scale*sq(this.adj2)
        let numsteps = Math.round(_plot.length/this.step);
        for (let steps = 0; steps < numsteps; steps++) {
            this.brush(); // PAINT TIP
            this.linepoint.plotTo(_plot,this.step,this.step)
        }
        if (this.marker) {paintColor(this.tono,0.4);}
        pop();
    }
    line (_x,_y,_par1,_par2,_tono,_scale,_type) { 
        push();
        this.scale = _scale, this.tono = color(_tono), this.distance = 0, this.tono.setAlpha(this.opacity);
        this.brushvariation();
        
        // Straight Lines
        if (_type == "straight") {
            this.x2 = _par1, this.y2 = _par2;
            this.difX = this.x2-_x, this.difY = this.y2-_y, this.difM = (Math.max(Math.abs(this.difX),Math.abs(this.difY))), this.linepoint = new Pos(_x,_y), this.length = dist(this.x2,this.y2,_x,_y);
            for (let k = 0; k <= Math.round(1000*this.difM*2/this.weight)/1000; k++) {
                this.brush() // PAINT TIP
                this.x_step = map(k,0,this.difM*2/this.weight,0,this.difX);
                this.y_step = map(k,0,this.difM*2/this.weight,0,this.difY);
                this.linepoint.update(_x+this.x_step,_y+this.y_step);
            } 
        } 
        // FieldLines
        else {
            this.x = _x, this.y = _y, this.length = _par1, this.dir = _par2, this.linepoint = new Pos(this.x,this.y);   
            this.step = this.step_length/this.scale*sq(this.adj2)  
            let numsteps = Math.round(this.length / pixel / this.step);            
            for (let steps = 0; steps < numsteps; steps++) {
                this.brush() // PAINT TIP
                this.linepoint.moveTo(this.step,this.dir,this.step)
            }
        }
        if (this.marker) {paintColor(this.tono,0.4,"marker");}
        pop();
    }
    brush() {
        if (this.spray) { // SPRAY TYPE BRUSHES
            this.vibr = (pixel*this.scale*this.vibration*this.bell(0.5,0.9,3,0.2,1))+pixel*this.vibration/5*randomGaussian();
            let strokeWii = rand(0.9*this.weight,1.1*this.weight);
            for (this.j = 0; this.j < this.quality; this.j++) {
                this.randSp = rand(0.9,1.1);
                this.randX = rand(this.randSp*-this.vibr, this.randSp*this.vibr);
                this.randY = rand(-1, 1) * sqrt(sq(this.randSp*this.vibr) - this.randX * this.randX);
                circle(this.linepoint.x + this.randX, this.linepoint.y + this.randY,strokeWii);
            }
        } else if (this.marker) { // MARKER TYPE BRUSHES
            maskBuffer.push();
            maskBuffer.fill(0,255,0,100);
            maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.scale*this.weight*this.bell(this.a,this.b,5,this.m1,this.m2));
            this.markerOpacity(0,this.randMark,"inicio");
            this.markerOpacity(this.randMark2,1,"final");
            for (this.j = 0; this.j < rande(1,4); this.j++) {
                this.markerOpacity(this.j*0.25+rand(0.05,0.30),this.j*0.25+rand(0.25,0.40));
            }
            maskBuffer.pop();
        }
        else { // REST OF BRUSHES
            this.vibr = pixel*this.scale*this.vibration*(this.def+(1-this.def)*this.bell(0.5,0.9,5,0.2,1)*randomGaussian());
            if (rand(0,this.quality)>0.4) {
                circle(this.linepoint.x+0.7*rand(-this.vibr,this.vibr),this.linepoint.y+rand(-this.vibr,this.vibr),rand(0.9*this.weight,1.1*this.weight)*this.bell(this.a,this.b,5,this.m1,this.m2));
            }
        }
    }
    markerOpacity(a,b,where) {
        this.distance = this.linepoint.plotted*pixel;
        if (this.distance < b*this.length && this.distance > a*this.length) {
            if (where == "inicio") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,0,1));} else if (where == "final") {this.opacity2 = this.opacity*(1-map(this.distance,a*this.length,b*this.length,1,0));}else {this.opacity2 = this.opacity*(1-Math.abs(map(this.distance,a*this.length,b*this.length,-1,1)));}
            maskBuffer.push();
            maskBuffer.fill(0,0,255,this.opacity2);
            maskBuffer.circle(this.linepoint.x+rand(-this.vibration,this.vibration),this.linepoint.y+rand(-this.vibration,this.vibration),this.scale*this.weight)
            if (this.distance <= rand(0.01,0.015)*this.length || this.distance >= rand(0.985,0.99)*this.length) {
                maskBuffer.circle(this.linepoint.x,this.linepoint.y,this.scale*this.weight)
            }
            maskBuffer.pop();
        }        
    }
    bell (a,b,c,m1,m2) {
        this.distance = this.linepoint.plotted*pixel;
        this.graph = (1/(1+pow(Math.abs((this.distance-a*this.length)/(b*this.length/2)),2*c)));
        return map(this.graph,0,1,m1,m2);
    }
}

let textureC, textureC1, textureC2;
let bgtexture = new LineStyle("spray");
let bgtexture2 = new LineStyle("2H");
// BG TEXTURE - This draws the different paper textures
function bgTexture(_step) {
    let chosenbg = color(colors[palette][1]);
    if (palette == 0) {
        //SPECIAL CORRUGATED PAPER
        if (_step == 0) {
            textureC = color(red(chosenbg)-8,green(chosenbg)-8,blue(chosenbg)-8);
        }
        for (let m = 0; m < 13; m++) {
            bgtexture2.line((2.5*13*_step+2.5*m)*pixel,0,(2.5*13*_step+2.5*m)*pixel,heightW,textureC,0.3,"straight")
        }
    } else if (palette == 4) {
        // NONE
    } else if (palette <= 6) {
        //BASIC
        if (_step == 0) {
            textureC = color(red(chosenbg)-25,green(chosenbg)-25,blue(chosenbg)-25);
        }
        if (_step%4 == 0) {
            bgtexture.line(160*_step/4*pixel,0,160*_step/4*pixel,heightW,textureC,30,"straight")
        }
    } else {
        //BASIC SUBTLE    
        if (_step == 0) {
            textureC = color(red(chosenbg)+25,green(chosenbg)+25,blue(chosenbg)+25);
        }
        if (_step%5 == 0) {
            bgtexture.line(640/3*_step/5*pixel,0,640/3*_step/5*pixel,heightW,textureC,40,"straight")
        }
    }
}