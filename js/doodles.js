// GLOBAL VARIABLES
let doodles = [], doodleNumber, totalElE = 0, totalElO = 0, density, borderMask = [], dots = [];

// Selection of Shapes
let  distSel = parseInt(weightedRand({
    0: 25,
    1: 25,
    2: 20,
    3: 10,
}));
if (compSel >= 1 || compSel == 0.5) {
    distSel = 1;
}

// COMPOSE CANVAS called once
function compose() {
    // CREATE DOODLES
    let plotType;
    function decideType(_a) {
        plotType = parseInt(weightedRand({
            0: _a[0],  // Suns - Moons - Squares
            1: _a[1],  // Flowers - Stars - Triangles
            2: _a[2],  // Clouds - Lighting - Stairs
            3: _a[3],  // Butterflies - Owl - Crown
        }));
    } 
    
    switch(compSel) {
        case 0: // Ensemble
            doodleNumber = 2 * rande(2,3.7);
            let gridSize = rande (3,4.9);
            let adjust = 1;
            if (marg == 0) {
                gridSize = 4
            }
            if (gridSize == 4) {
                doodleNumber = 6;
                adjust = 0.9;
            }
            for (i=0;i<gridSize+1;i++) {
                dots.push([]);
                for (j=0;j<gridSize+1;j++) {
                    dots[i][j] = [ 2*w1Active + j * (w2Active-w1Active-2*w1Active) / gridSize , 2*h1Active + i * (h2Active-h1Active-2*w1Active) / gridSize , 0];
                    cross(dots[i][j][0],dots[i][j][1],7);
                }
            }
            let dRow = rande(1,gridSize-0.01), dRow1 = 1;
            let dCol = rande(1,gridSize-0.01), dCol1 = 1;
            if (dRow == 1) {dRow1 = 2}
            if (dCol == 1) {dCol1 = 2}
            let dRowA = 0,dRowB = 0,dColA = 0,dColB = 0;
            
            function move(_nr) {
                let res;
                if (fxrand() < 0.8) {sum = 1} else {sum = 0}
                if (fxrand() < 0.5) {mult = -1} else { mult = 1}
                if (_nr == 0) {res = _nr + sum;}
                else if (_nr == gridSize) {res = _nr - sum}
                else {res = _nr + mult*sum}
                return res;
            }
            doodles.push(new Doodle(new Plot(i,adjust*rand(1,1.5)-marg),dots[dRow1][dCol1][0],dots[dRow1][dCol1][1]));
            dots[dRow1][dCol1][2] = 1;
            
            for (i=0;i<doodleNumber-1;i++) {
                doodles.push(new Doodle(new Plot(i,adjust*rand(1,1.5)-marg),dots[dRow][dCol][0],dots[dRow][dCol][1]))
                dots[dRow][dCol][2] = 1;
                dRowp = dRow;
                dColp = dCol;
                while (dRow == dRowp && dCol == dColp) {
                    while (dots[dRow][dCol][2] == 1) {
                        dRow = move(dRow);
                        dCol = move(dCol);
                    }
                    if ((dCol == 0 && dColA == 1) || (dCol == gridSize && dColB == 1) || (dRow == 0 && dRowA == 1) || (dRow == gridSize && dRowB == 1)) {
                        dRow = dRowp;
                        dCol = dColp;
                    } else {
                        if (dRow == 0) {dRowA = 1;} else if (dRow == gridSize) {dRowB = 1;}
                        if (dRowA !== 1 || dRowB !== 1) {
                            if (dCol == 0) {dColA = 1;} else if (dCol == gridSize) {dColB = 1;}
                        }
                    }
                }
            }
            density = 0.85;
            if (doodleNumber < 5) {
                density = 0.95;
            }
        break;
        case 1: // Tears in Rain
            density = rand(0.50,0.85);
            if (plotType >= 2) { density = rand (0.45,0.75)}
            
            var numCols = 2 * rande(4,5.99) + 1;
            var x_sep = (w2Active-w1Active)/(numCols-1);
            var numRows = Math.round((h2Active-h1Active)/x_sep)+1;
            var y_sep = (h2Active-h1Active)/(numRows-1);
            doodleNumber = 0;
            decideType([30,25,10,5]);
            if (mvtSel == 2) {
                decideType([25,25,25,25]);
            }
            var scarcity = rand(0.15,0.35);
            var init_dot = new Pos(w1Active,h1Active);
            for (var i=0;i<numRows;i++) {
                var insert = new Pos(init_dot.x,init_dot.y);
                for (j=0;j<numCols;j++) {
                    
                    if (fxrand() > scarcity) {
                        doodles.push(new Doodle(new Plot(plotType,rand(0.28,0.38)-marg/3),insert.x,insert.y));
                        doodleNumber++;
                    }
                    cross(insert.x,insert.y,10-numCols);
                    insert.moveTo(Math.round(1000*x_sep/pixel)/1000,0);
                }
                init_dot.moveTo(Math.round(1000*y_sep/pixel)/1000,270,0.4,1);
            }
            
        break;
        case 2: // Duet
        var _r = fxrand();
        function pos(_a) {
            if (_r<0.5) {
                return _a * widthW/3;
            } else {
                return (3-_a) * widthW/3;
            }
        }
        decideType([90,10,0,0]);
        if (mvtSel == 2) {
            decideType([25,25,25,25]);
        }
        doodles.push(new Doodle(new Plot(plotType,rand(1.7,2.2)-marg),pos(1),heightW/3))
        doodles.push(new Doodle(new Plot(plotType,rand(1.7,2.2)-marg),pos(2),2*heightW/3))
        doodleNumber = 2;
        density = 1;
        break;
    }
    doodles = shuffler(doodles); // Random Draw Order
}

function cross (_x,_y,_s) {
    gridLines.line(_x,_y,_x,_y+_s*pixel,gridColor,0.5,"straight")
    gridLines.line(_x,_y,_x,_y-_s*pixel,gridColor,0.5,"straight")
    gridLines.line(_x,_y,_x+_s*pixel,_y,gridColor,0.5,"straight")
    gridLines.line(_x,_y,_x-_s*pixel,_y,gridColor,0.5,"straight")
}

// PLOT class and functions
class Plot {
    constructor (_id,_scale) {
        this.segments = [];
        this.angles = [];
        this.scales = [];
        this.outer = [];
        this.doodleScale = _scale;
        this.dist;
        var outer = 0;
        switch(mvtSel) {
            case 0: // Prelude
                this.dist = [
                    [0,0,0,0,0,0],
                    [0,1,2,3,1,0],
                    [0,2,3,2,0,3],
                    [1,3,1,3,1,1]
                ];
                switch(this.dist[distSel][_id]) {
                    case 0: // SUN
                        this.doodle = "sun";
                        this.dir = 0;
                        if (rand(0,1)<0.15) { this.type = "truncated";} else { this.type = "curve";}
                        var size = this.doodleScale*140;
                        var spiral = rand(14,17);
                        var init_angle = rand(75,85);
                        var angle_var = rande(60,80);
                        this.adjust = [-size/1.1,0];
                        var i;
                        for (i=0; i <= rande(9,14); i++) {
                            if(i<5) {outer = 1} else {outer = 0}
                            this.push(init_angle-angle_var*i,(2.5-compSel/2)-i/10,size-i*size/spiral,outer)
                        }
                        this.angles.push(init_angle-angle_var*i);
                    break;
                    case 1: // FLOWER
                    
                        this.doodle = "flower";
                        this.dir = 0;
                        this.type = "curve";
                        var petal_angle = rande(20,25);
                        var stem_length = this.doodleScale*rand(90,200);
                        this.adjust = [0,stem_length];

                        // stem
                        this.push(rande(80,120),0,stem_length)
                        this.push(this.angles[0]+rande(-10,10),0,0)
                        this.push(this.angles[1],0,0)

                        // pistil
                        var pistSize = rand(50,90);
                        this.push(this.angles[2]+90,-0.3,this.doodleScale*pistSize)
                        this.push(this.angles[3]-180,-0.3,this.doodleScale*pistSize)
                        this.push(this.angles[4]-180,0,0)
                        this.push(this.angles[5],0,0)
                        
                        //petals
                        this.angles.push(this.angles[6]-(270));

                        for (var i=0; i < 6; i++) {
                            var petal_length = this.doodleScale*rande(250,350);
                            this.push(this.angles[7+6*i]-petal_angle,-0.5,petal_length/3,1);
                            this.push(this.angles[8+6*i]-90,-1,petal_length/7,1);
                            this.push(this.angles[9+6*i]-90,-1,petal_length/7,1);
                            this.push(this.angles[10+6*i]-petal_angle,-0.5,petal_length/3,1);
                            this.push(this.angles[11+6*i]-110,0,0,1);
                            this.push(this.angles[12+6*i]-(90),0,0,1);
                        }
                    break;
                    case 2: // CLOUD
                        this.doodle = "cloud";
                        this.dir = 0;
                        this.type = "curve";
                        var init_angle = rande(160,190);
                        var base_size = 85*this.doodleScale;
                        this.adjust = [-1.3*base_size,0.7*base_size/2];
                        for (i=0;i<5;i++) {
                            var lll = Math.abs(Math.abs(-2+i)-2)
                            this.push(init_angle-(180+25)*2*i+10*i,-0.5,rand(lll*base_size,(lll+1)*base_size),1)
                            this.push(init_angle-180-25-(180+25)*2*i+10*2*i,0,0,1)
                        }
                        
                        this.push(0,0,0,1)
                        this.push(180+15,2,base_size*3,1)
                        
                        for (let j=0;j<5;j++) {
                            var lll1 = Math.abs(Math.abs(-2+i)-2)
                            this.push(init_angle-(180+25)*2*j+10*j,0.3,rand(lll1*base_size*0.7,(lll1+1)*base_size*0.7))
                            this.push(init_angle-180-25-(180+25)*2*j+10*2*j,0,0)
                        }
                        this.angles.push(180)
                    break;
                    case 3: // BUTTERFLY
                        this.doodle = "butterfly";
                        this.type = "curve";
                        this.dir = 180;
                        var mult = this.doodleScale*1.5;
                        var angle0 = rand(20,60);
                        this.adjust = [-rande(20,70)*mult,10*mult];
                        
                        this.push(angle0,0,10)
                        this.push(this.angles[0]-90,0,40*mult)
                        this.push(this.angles[1]-10,0,0)
                        this.push(this.angles[2]+55,0,75*mult)
                        this.push(this.angles[3]-30,0,5*mult)
                        this.push(this.angles[4]+90,0,5*mult)
                        this.push(this.angles[5]+90,0,20*mult)
                        this.push(this.angles[6],0,0)
                        this.push(this.angles[7]-160,0,0)
                        this.push(this.angles[8],0.15,30*mult,1)
                        this.push(this.angles[9]+170,0.15,10*mult,1)
                        this.push(this.angles[10],0,0)
                        this.push(this.angles[11]-170,0.15,10*mult,1)
                        this.push(this.angles[12],0.15,20*mult,1)
                        this.push(this.angles[13]+190,0.15,10*mult,1)
                        this.push(this.angles[14],0,0)
                        this.push(this.angles[15]-160,0.15,40*mult,1)
                        this.push(this.angles[16]-10,0.15,15*mult,1)
                        this.push(this.angles[17]-150,0.15,15*mult,1)
                        this.push(this.angles[18],0,0)
                        this.push(this.angles[19]+160,0,35*mult,1)
                        this.push(this.angles[20]-180,0,0)
                        this.push(this.angles[21]+150,0,25*mult,1)
                        this.push(this.angles[22]-150,0,0)
                        this.push(this.angles[23]+120,-0.15,15*mult,1)
                        this.push(this.angles[24]+120,-0.3,40*mult,1)
                        this.push(this.angles[25]+15,-0.3,55*mult,1)
                        this.push(this.angles[26]+110,0,0)
                        this.push(this.angles[27]-170,0.15,25*mult,1)
                        this.push(this.angles[28],0.15,25*mult,1)
                        this.push(this.angles[29]+170,0.15,15*mult,1)
                        this.push(this.angles[30],0,0)
                        this.push(this.angles[31]-150,0.15,20*mult,1)
                        this.push(this.angles[32],0.15,20*mult,1)
                        this.push(this.angles[33]+160,0.15,10*mult,1)
                        this.push(this.angles[34],0,0)
                        this.push(this.angles[35]-160,0.15,30*mult,1)
                        this.push(this.angles[36]+20,0.15,20*mult,1)
                        this.push(this.angles[37]+150,0.15,45*mult,1)
                        this.push(this.angles[38]+30,0,0)
                        this.push(this.angles[39]-170,0.2,65*mult,1)
                        this.push(this.angles[40]-30,0.5,30*mult,1)
                        this.push(this.angles[41]-140,0.5,50*mult,1)
                        this.push(this.angles[42]+30,0.5,65*mult,1)
                        this.push(this.angles[43]-115,0.2,50*mult,1)
                        this.push(this.angles[44]-15,0,0)
                        this.push(this.angles[45]-130,0.15,18*mult,1)
                        this.push(this.angles[46]+10,0.15,17*mult,1)
                        this.push(this.angles[47]+150,0.15,13*mult,1)
                        this.push(this.angles[48]+20,0,0)
                        this.push(this.angles[49]-170,0.15,18*mult,1)
                        this.push(this.angles[50]+20,0.15,13*mult,1)
                        this.push(this.angles[51]+150,0.15,13*mult,1)
                        this.push(this.angles[52]+15,0,0)
                        this.push(this.angles[53]-160,0.15,40*mult,1)
                        this.push(this.angles[54],0.15,15*mult,1)
                        this.push(this.angles[55]+170,0.1,105*mult,1)
                        this.push(this.angles[56]+50,0,5*mult)
                        this.push(this.angles[57]-180,0.2,135*mult,1)
                        this.push(this.angles[58]-50,0.5,35*mult,1)
                        this.push(this.angles[59]-160,0.5,40*mult,1)
                        this.push(this.angles[60]+20,0.4,35*mult,1)
                        this.push(this.angles[61]+35,0.5,35*mult,1)
                        this.push(this.angles[62]-120,0.5,25*mult,1)
                        this.push(this.angles[63],0,20*mult)
                        this.push(this.angles[64]-180,0,25*mult)
                        this.push(this.angles[65]-25,0,30*mult)
                        this.push(this.angles[66],0,10*mult)
                        this.push(this.angles[67]-80,0.5,55*mult,1)
                        this.push(this.angles[68]-20,0,10*mult)
                        this.push(this.angles[69]-107,0.2,68*mult,1)
                        this.push(this.angles[70]+25,0,5*mult)
                        this.push(this.angles[71]+150,0,50*mult)
                        this.push(this.angles[72]+20,0,10*mult)
                        this.push(this.angles[73]+170,0,50*mult)
                        this.push(this.angles[74]+10,0,8*mult)
                        this.push(this.angles[75]+40,0,15*mult)
                        this.push(this.angles[76]-180,0,3*mult)
                        this.push(this.angles[77],0,5*mult)
                        this.push(this.angles[78]-270,0,35*mult)
                        this.push(this.angles[79]+30,0,20*mult)
                        this.angles.push(this.angles[80]+40)
                    break;
                }
            break;
            case 1: // Berceuse
                this.dist = [
                    [0,0,0,2,1,1],
                    [0,1,3,1,2,0],
                    [1,2,2,1,3,2],
                    [0,1,2,1,0,1],
                ];
                switch(this.dist[distSel][_id]) {
                    case 0: // STARS
                        this.doodle = "star";
                        this.dir = 0;
                        this.type = "truncated";
                        var size = this.doodleScale*300;
                        var sides = 5, init_angle = 36; 
                        var dir = rande(-15,15)
                        this.adjust = [-size/2.7,+size/4];
                        if (fxrand() < 0.3) {
                            sides = 7;
                            init_angle = 180/7;
                            this.adjust = [-size/2,+size/6.3];
                        }
                        this.push(init_angle+dir,1*rand(0.6,1.8),3*size/8,1);
                        this.push(init_angle+dir,0.1,2*size/8);
                        this.push(init_angle+dir,1*rand(0.6,1.8),3*size/8,1);

                        for (var i=0; i < sides-1; i++) {
                            this.push(this.angles[3*i]+(180+init_angle),1*rand(0.6,1.8),3*size/8,1);
                            this.push(this.angles[3*i]+(180+init_angle),0.1,2*size/8);
                            this.push(this.angles[3*i]+(180+init_angle),1*rand(0.6,1.8),3*size/8,1);
                        }
                        this.angles.push(init_angle+dir+(180+init_angle));
                    break;
                    case 1: // MOON
                        this.doodle = "moon";
                        this.dir = 0;
                        this.type = "curve";
                        var size = this.doodleScale*500;
                        var init_angle = rande(-15,15);            
                        const phases = [
                            [], // FULL MOON
                            [230+init_angle,-250,-45,163,0.68*size], // CRESCENT
                            [230+init_angle,-250,-20,130,0.5*size], // ARAB
                        ];
                        const phaseSel = parseInt(weightedRand({
                            0: 5,
                            1: 50,
                            2: 50,
                        }));
                        if (phaseSel >= 1) {
                            this.adjust = [size/6,+size/6];
                            this.push(phases[phaseSel][0],1.5,size,1);
                            this.push(phases[phaseSel][0]+phases[phaseSel][1],0,0,1);
                            this.push(phases[phaseSel][0]+phases[phaseSel][2],-1,phases[phaseSel][4],1)
                            this.push(phases[phaseSel][0]+phases[phaseSel][3],0,0,1);
                        } else if (phaseSel == 0) {
                            size = this.doodleScale*350;
                            this.adjust = [0,+size/3.2];
                            // BASE
                            this.push(180+init_angle,1.5,size,1);
                            this.push(180-180+init_angle,0,0,1);
                            this.push(180+180+init_angle,1,size,1)
                            this.push(180+init_angle,0,0,1);
                        
                            // CRATERS
                            this.push(this.angles[3]+rande(-5,5),0,size/3*rand(0.9,1.1));
                            this.push(this.angles[4]-150,0.8,size/5*rand(0.9,1.4));
                            this.push(this.angles[5]-180,-0.20,size/5*rand(0.9,1.4));
                            this.push(this.angles[6]-180,0,0);
                            this.push(this.angles[7]+rande(-5,5),0,size/3*rand(0.9,1.1));
                            this.push(this.angles[8]+150,0.25,size/4*rand(0.75,1.3));
                            this.push(this.angles[9]+180,-0.8,size/4*rand(0.75,1.3));
                            this.push(this.angles[10]+180,0,0);
                            this.push(this.angles[11]-100+rande(-5,5),0,size/3*rand(0.9,1.1));
                            this.push(this.angles[12]-130,0.8,size/7*rand(0.6,1));
                            this.push(this.angles[13]-180,-0.25,size/7*rand(0.6,1));
                            this.push(this.angles[14]-180,0,0)
                        } 
                        this.angles.push(init_angle)
                    break;
                    case 2: // NIGHT FLOWER
                        this.doodle = "flower_night";
                        this.dir = 0;
                        this.type = "curve";
                        var size = this.doodleScale*230;
                        this.adjust = [0,1*size];
                        var init_angle = rande(95,105);

                        // STEM and LEAF
                        this.push(init_angle,0,size/2);
                        this.push(this.angles[0]-20,0,size/4)

                        this.push(this.angles[1]-30,-0.3,size/3)
                        this.push(this.angles[2]-20,0,0)
                        this.push(this.angles[3]-120,0.3,size/2)
                        this.push(this.angles[4]-50,0.3,size/5)
                        this.push(this.angles[5]-130,0,size/3)

                        this.push(this.angles[6]+10,0,size/3)

                        // PETAL 1
                        this.push(this.angles[7]+10,1.3,size/2,1)
                        this.push(this.angles[8]+90,1.3,size/5,1)
                        this.push(this.angles[9]+90,1.3,size/5,1)
                        this.push(this.angles[10]+20,1.3,size/2,1)

                        // JUNCTION
                        this.push(this.angles[11]+70,0,size/3,1)
                        this.push(this.angles[12]+70,0,size/3,1)

                        // PETAL 2
                        this.push(this.angles[13]+10,1,size/2.5,1)
                        this.push(this.angles[14]+90,1,size/6,1)
                        this.push(this.angles[15]+90,1,size/6,1)
                        this.push(this.angles[16]+10,1,size/2,1)

                        // JUNCTION
                        this.push(this.angles[17]+40,0.2,size/4,1)
                        this.push(this.angles[18]+90,0.7,size/4,1)

                        // PETAL 3
                        this.push(this.angles[19]+25,0.9,size/3,1)
                        this.push(this.angles[20]+90,0.9,size/6,1)
                        this.push(this.angles[21]+90,0.9,size/6,1)
                        this.push(this.angles[22]+15,0.9,size/4,1)

                        // JUNCTION
                        this.push(this.angles[23]+10,-0.5,size/7,1)
                        this.push(this.angles[24]-60,-0.5,size/4,1)

                        // PETAL BACK
                        this.push(this.angles[25]-70,0,size/2)
                        this.push(this.angles[26]-60,-0.15,size/3,1)
                        this.push(this.angles[27]-90,-0.15,size/8)

                        this.angles.push(this.angles[28]-40);
                    break;
                    case 3: // OWL
                        this.doodle = "owl";
                        this.type = "curve";
                        var init_angle = 290+rande(-10,10);
                        this.dir = 0;
                        var size = this.doodleScale*250;
                        this.adjust = [-size/2.7,-size/10];
                        
                        this.push(init_angle-10,0.5,size/4,1);

                        for (var i = 0; i<5; i++) {
                            this.push(this.angles[0+6*i],0.5,size/7,1);
                            this.push(this.angles[1+6*i]+95,0.5,size/15,1);
                            this.push(this.angles[2+6*i]+80,0,(1+i)/2 * size/30);
                            this.push(this.angles[3+6*i]-10,0,(1+i)/5*size/25+size/23);
                            this.push(this.angles[4+6*i]+170,0.5,(1+i)/5*size/25+size/23);
                            this.push(this.angles[5+6*i]+30,0.5,(1+i)/2 * size/30+(i)*size/30,1);
                        }
                        
                        this.push(this.angles[30],1,size/15,1);
                        this.push(this.angles[31]+90,0,size/30,1);
                        this.push(this.angles[32]+58,0.5,size/1.7,1);
                        this.push(this.angles[33]+14,1,size/1.4,1);
                        this.push(this.angles[34]+92,0.6,size/3.5,1);
                        this.push(this.angles[35]-110,0.3,size/10,1);
                        this.push(this.angles[36]-15,0,0);
                        this.push(this.angles[37]+205,0,size/12);
                        this.push(this.angles[38]+10,0,size/4);
                        this.push(this.angles[39]+190,0,size/5);
                        this.push(this.angles[40]+190,rande(0,1.2),size/6);
                        this.push(this.angles[41]+190,rande(0,1.2),size/6);
                        this.push(this.angles[42]+340,0,size/3.5);
                        this.push(this.angles[43]+70,0,size/13);
                        this.push(this.angles[44]+180,0.3,size/5,1);
                        this.push(this.angles[45]+10,0.5,size/8,1);
                        this.push(this.angles[46]-30,0.3,size/5,1);
                        this.push(this.angles[47]+10,0,size/11);
                        this.push(this.angles[48]+180,0,size/17);
                        this.push(this.angles[49]+10,0,size/4);
                        this.push(this.angles[50]+97,0.3,size/11);
                        this.push(this.angles[51]+185,0.3,size/11);
                        this.push(this.angles[52]+155,rande(0.5,1.3),size/4.5);
                        this.push(this.angles[53]+160,rande(0.5,1.3),size/4,1);
                        this.push(this.angles[54]+175,0,size/6.5,1);
                        this.push(this.angles[55]+30,0,0);
                        this.push(this.angles[56]+210,0,size/15);

                        this.angles.push(this.angles[57]);

                    break;
                }
            break;
            case 2: // Escalier
                this.dist = [
                    [0,0,0,3,1,1],
                    [0,1,2,3,1,0],
                    [2,0,2,1,3,2],
                    [1,3,2,1,0,1],
                ];
            switch(this.dist[distSel][_id]) {
                case 0: // DIAMONDS
                    this.doodle = "diamond";
                    this.dir = 0;
                    var dir = rande(-5,5)
                    this.type = "curve";
                    var size = this.doodleScale*195;
                    this.adjust = [-size/2,0];
                    var vueltas = rande(3,5);
                    var scale = rand(4,6);
                    var def = rande(5,30)
                    this.push(60-10+dir,rand(1.2,1.8),size,1)
                    this.push(60+10+dir,0,0)
                    for (var l=0; l <= vueltas; l++) {
                        if (l < 2) { outer = 1}
                        this.push(this.angles[0+4*l]+270-def,rand(0.8,1.8),size-l*size/scale,outer)
                        if (l == 1) { outer = 0}
                        this.push(this.angles[1+4*l]+270-def,0,0)
                        this.push(this.angles[2+4*l]+270+def,rand(0.8,1.8),size-l*size/scale,outer)
                        this.push(this.angles[3+4*l]+270+def,0,0)
                    }
                    this.angles.push(90);
                break;
                case 1: // CLUBS
                    this.doodle = "club";
                    this.dir = 0;
                    this.type = "curve";
                    var dir = rande(-5,5);
                    var size = this.doodleScale*220;
                    this.adjust = [0,+size/1.2];
                    var leaves = 3;
                    if (fxrand()<0.15) {leaves++}
                    // STEM
                    this.push(80+dir,0,size)
                    this.push(this.angles[0]+10,0,0)
                    // HOJAS
                    for (var i = 0; i < leaves; i++) {
                        var scale = rand(0.9,1.1)
                        this.push(this.angles[1]+135-rande(75,95)*i,-0.85,size/2*rand(0.9,1.1)*scale,1)
                        this.push(this.angles[2+6*i]-51,-0.85,size/2*rand(0.9,1.1)*scale,1)
                        this.push(this.angles[3+6*i]-185,0,size/10*rand(0.9,1.1)*scale,1)
                        this.push(this.angles[4+6*i]-185,-0.25,size/2*rand(0.9,1.1)*scale,1)
                        this.push(this.angles[5+6*i]-185,-0.25,size/2*rand(0.9,1.1)*scale,1)
                        this.push(this.angles[6+6*i]-51,0,0)
                    }
                    this.angles.push(0)
                break;
                case 2: // HEARTS
                    this.doodle = "heart";
                    this.dir = 0;
                    this.type = "curve";
                    var dir = rande(-5,5);
                    var size = this.doodleScale*220;
                    this.adjust = [-size/6,+size/1.8];
                    var hearts = rande(2.4,4.2);
                    // HOJAS
                    for (var i = 0; i < hearts; i++) {
                        var scale = rand(0.9,1.1)
                        if (i == 0) {outer = 1} else {outer = 0}
                        this.push(135+dir,-rand(0.8,1.9),size*rand(0.9,1.1)-i*size/5,outer)
                        this.push(this.angles[0+6*i]-51,-rand(0.8,1.9),size*rand(0.9,1.1)-i*size/10,outer)
                        this.push(this.angles[1+6*i]-185,0,size/5*rand(0.9,1.1),outer)
                        this.push(this.angles[2+6*i]-185,-0.2,size-i*size/10,outer)
                        this.push(this.angles[3+6*i]-185,-0.2,size*rand(0.9,1.1)-i*size/10,outer)
                        this.push(this.angles[4+6*i]-51,0,0)
                    }
                    this.angles.push(0)
                break;
                case 3: // SPADES
                    this.doodle = "spade";
                    this.dir = 0;
                    this.type = "curve";
                    var dir = rande(-5,5);
                    var size = this.doodleScale*180;
                    this.adjust = [-size/3,+size/1.6];
                    this.push(45+dir,-0.5,size/2,1)
                    this.push(this.angles[0]+25,-0.5,0)
                    this.push(this.angles[1]+150,-rand(0.5,1.8),size,1)
                    this.push(this.angles[2]-180,-rand(0.5,1.8),size/1.45,1)
                    this.push(this.angles[3]+10,0,0)
                    this.push(this.angles[4]+180+80,-rand(0.5,1.8),size/1.45,1)
                    this.push(this.angles[5]+10,-rand(0.5,1.8),size,1)
                    this.push(this.angles[6]-180,0,0)
                    this.push(this.angles[7]+150,-0.7,size/2,1)
                    this.push(this.angles[8]+25,-0.95,0)
                    this.push(this.angles[9]-135,0.7,size/1.5,1)
                    this.angles.push(this.angles[10])
                break;
            }
            break;
        }
        this.length =  Math.round(1000*this.segments.reduce((partialSum, a) => partialSum + a, 0))/1000;
    }
    push (_a,_sca,_seg,_out) {
        if (typeof _a !== 'undefined') {this.angles.push(_a);}
        if (typeof _seg !== 'undefined') {if(_seg == 0) {_seg = 1}; this.segments.push(_seg);}
        if (typeof _sca !== 'undefined') {this.scales.push(_sca);}
        if (typeof _out !== 'undefined') {this.outer.push(_out);} else {this.outer.push(0);}
    }
    angle (_d) {
        if (_d > this.length) { return 0; }
        this.calcIndex(_d);
        switch (this.type) {
            case "curve":
                return map(_d-this.suma,0,this.segments[this.index],this.angles[this.index],this.angles[this.index+1],true);

            case "truncated":
                return this.angles[this.index];
        }
    }
    border (_d) {
        if (_d > this.length) { return 0; }
        this.calcIndex(_d);
        return this.outer[this.index];
    }
    scale (_d) {
        if (_d > this.length) { return 0; }
        this.calcIndex(_d);
        return this.scales[this.index];
    }
    calcIndex(_d) {
        this.index = -1;
        let d = 0; this.suma = 0;
        while (d <= _d) {
            this.suma = d
            d += this.segments[this.index+1]
            this.index++;
        }
    }
}

// DOODLE class and functions
class Doodle {
    constructor(_plot,_x,_y) {
        this.origin = {x:_x,y:_y}
        this.plot = _plot;
        
        // Line size and separation
        switch(compSel) {
            case 0: // ENSEMBLE
                this.param = [rande(9,15),4]
                break;
            case 1: // TEARS IN THE RAIN
                this.param = [rande(13,17),2.8]
                break;
            case 2: // DUET
            this.param = [rande(13,17),5]
            break;
            case 0.5: // TO BE DELETED
                this.param = [rande(15,20),4]
                break;
        }
        this.baseSize = this.param[0]*pixel;
        if (superOrder != 0) {this.separacion = this.param[1]}
        else {this.separacion = rand(0.8,1.2)*this.param[1]}
        this.size = _plot.doodleScale * 3.5 * this.baseSize;
        // Arrays
        this.elements = [];
        this.length = 0;
        this.bg = [];
        this.hull = [];
        // FEATURES
        if (selective == 1) {
            if (compSel == 1) {
                this.globalBrush = selectiveStylesB[rande(0,selectiveStyles.length-0.1)]
            } else {
                this.globalBrush = selectiveStyles[rande(0,selectiveStyles.length-0.1)]
            }
        }
        // THINGS FOR RAINBOW
        this.randColor = rande(2,7.9);
        this.groupnr = 0;
        this.groupsize = rande(4,10);
        this.gridColor = gridColor;
        // Multicolour if Rainbow
        if (palette == 5 && rainbow >= 0) {gridColor = colors[palette][Math.floor(2+fxrand()*5.9)] }
    }
    guideLines() {
        gridLines.plot(this.plot,this.origin.x,this.origin.y,this.gridColor,0.7);
    }
    distribute (j) {
        this.id = j;
        this.maxR = this.plot.length/this.separacion;
        this.prob = fxrand();
        this.current = new Pos(this.origin.x+this.plot.adjust[0]*pixel,this.origin.y+this.plot.adjust[1]*pixel);
        for (this.k=0; this.k<int(this.maxR); this.k++) {
            let scale = this.plot.scale(this.current.plotted);
            let angle = this.plot.angle(this.current.plotted);
            if (scale < 0) {
                angle = angle+180;
                scale = scale*-1;
            }
            if (caffeine == 1) { // CAFFEINE MODE
                this.adjust = scale*rand(1.2,1.5);
            }
            else { this.adjust = scale; }
            if (scale!==0) {
                if (this.k<=this.maxR/2) {this.weight = (this.maxR-this.k/2+1);}
                else {this.weight = (this.maxR-(this.maxR-this.k)*2+1);}
                
                // CONTINUOUS WEIGHED DISTRIBUTION - Distribution of strokes along the col
                this.area = parseInt(weightedRand({
                    0: (pow(this.maxR,2)/pow(this.k+1,3)),
                    1: (pow(this.maxR,2)/pow(this.weight,3)),
                    2: (pow(this.maxR,2)/pow(this.maxR-this.k+1,3)),
                }));

                // CREATE BRUSHES following the different distributions and special effects
                switch(this.area) {
                    case 0:
                        if(this.obsession(1)) {this.typeLines(typeDist[0],angle-this.plot.dir)}
                    break;
                    case 1:
                        if(this.obsession(3)) {this.typeLines(typeDist[1],angle-this.plot.dir)}
                    break;
                    case 2:
                        if(this.obsession(4.5)) {this.typeLines(typeDist[2],angle-this.plot.dir)}
                    break;
                }
            }
            // CREATE BACKGROUND HULL
            if (this.plot.border(this.current.plotted)==1 && this.k%int(randomGaussian(5, 4)) == 0) {
                    this.hull.push([this.current.x,this.current.y]);
            }
            this.current.plotTo(this.plot,this.separacion);
        }
        // Shift elements randomly without changing order
        let shift = rande(0,this.hull.length);
        this.hull = this.hull.slice(shift,this.hull.length).concat(this.hull.slice(0,shift));
        // BAGROUND
        for(let h of this.hull) {
            this.bg.push(createVector(h[0],h[1]))
        }
        // BG LAYERS
        this.bgLayers = watercolor.genMask(this.bg);
        this.length = this.elements.length;
    }
    typeLines (n,dir) {
        if (selective == 1) {if (rande(0,12.8) == 4) {this.brush = "spray"} else {this.brush = this.globalBrush}} else if (compSel == 1) {this.brush = styles[rande(0,7.5)]} else {this.brush = styles[rande(0,8.9)]}
        switch(n) {
            case 0:
                this.displace = rande(0,4.9);
                this.lineColor = colors[palette][this.displace+rande(2,3.5)];
                this.strokew = 0.8*map(this.plot.doodleScale,0,3,0.7,1.2);
                if (this.brush == "charcoal") {this.strokew = 0.7}
                if (rainbow !== 0)  {this.lineColor = this.rainbow(this.id+1); }
                var elPush = [this.brush,this.current.x,this.current.y,this.adjust*this.size*0.7*rand(0.8,1.2),90+dir,this.lineColor,this.strokew];
            break;
            case 1:
                this.displace = rande(0,3.9);
                this.lineColor = colors[palette][this.displace+rande(2,4.5)];
                this.strokew = 1*map(this.plot.doodleScale,0,3,0.8,1.3);
                if (this.brush == "charcoal") {this.strokew = 0.9}
                if (rainbow !== 0)  {this.lineColor = this.rainbow(this.id+1); }
                var elPush = [this.brush,this.current.x,this.current.y,this.adjust*this.size*rand(0.8,1.2),90+dir,this.lineColor,this.strokew];
            break;
            case 2:
                this.lineColor = colors[palette][rande(2,7.9)];
                this.strokew = rand(1.2,1.5)*map(this.plot.doodleScale,0,3,0.7,1.5);
                if (this.brush == "charcoal") {this.strokew = 1}
                if (rainbow !== 0)  {this.lineColor = this.rainbow(this.id+1); }
                this.numRows = rande(2,2+5.5*this.k/this.maxR);
                var elPush = [this.brush,this.current.x,this.current.y,this.adjust*this.size*1.3*rand(0.8,1.2),90+dir,this.lineColor,this.strokew];   
            break;
        }
        if(this.current.isInCanvas()) {
            if (this.prob < density) {
                this.elements.push(elPush);
            }
        }
    }
    obsession (n) { // For SuperOrder effects
        switch (superOrder) {
            case 0:
                return (rande(0,this.k*rand(0,3))>=n*10)
            case 1:
                return this.k%2 == 0
            case 2:
                return this.k%3 == 0
        }
    }
    rainbow() { // For Color effects
        switch(rainbow) {
            case 1:
                this.groupnr++
                if (this.groupnr == this.groupsize) {
                    this.groupnr = 0;
                    this.randColor++;
                    if (this.randColor > 7) {
                        this.randColor = 2;
                    }
                }
                return colors[palette][this.randColor];        
            case 2:
                return colors[palette][Math.floor(map(this.id,0,doodleNumber,2,7.9,true))];
            case 3:
                return colors[palette][this.randColor];
        }
    }
}