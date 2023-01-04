let masks = [], bgTip, bgDir, bgHatch = [], bgBands = [], bgDots, nrWC = 0, empty = ["no"], marcoMask = [], doneW = 0, doneH = 0;

class PaintBrush {
    constructor(_brush) {
      switch(_brush) {
          case "watercolor":
          // Watercolor tip formula
              this.polygon = _size => {
                this.v = [];
                this.m = [];
              for(this.i = 0; this.i < 8; this.i ++) {
                this.a = this.i * (360/8);
                this.v.push(createVector(cos(this.a+45) * _size, sin(this.a+45) * _size ));
                if (fxrand()<0.8) {
                    this.m.push(0.05);
                } else {
                    this.m.push(rand(0.3,0.8));
                }
              }
          }
          break;
      }
    }
    fill (_v,_m,_c,_i) {
      this.color = _c;
      this.v = _v;
      // Fluidity
      this.m = [];
      let fluid = rand(0,0.4*this.v.length)
      for (let i = 0; i<this.v.length;i++) {
        if (i<fluid) {
          this.m.push(-(rand(0.5,1.1)*_m))
        } else {
          this.m.push(-(rand(0.4,1)*_m/3))
        }
      }
      // Generate Polygon
      this.tip = new Tip(this.v,this.m,this.color,this.calcCenter());
      // Draw Spot
      this.tip.fill(0.015*_i,0.019*_i); 
    }
    bgBand (_v,_m,_c) {
      this.color = _c;
      this.v = _v;
      this.m = [];
      for (let j = 0; j<2; j++) {
        for (let i = 0; i < (this.v.length - 2)/2; i++) {
          this.m.push(-_m);
        }
        this.m.push(-0.1);
      }
      // Generate Polygon
      this.tip = new Tip(this.v,this.m,this.color,this.calcCenter());
      // Draw Spot
      this.tip.band(0.012,0.016);
    }
    stroke (_c, _xpos, _ypos, _size) {
      this.polygon(_size);
      this.color = _c;
      this.tip = new Tip(this.v,this.m,this.color,createVector(_xpos,_ypos), _xpos, _ypos);
      this.tip.stroke(0.008,0.004); 
    }
    genMask (_v,_m) {
      this.v = _v;
      if (!_m) {
        this.m = [];
        let fluid = rand(0,0.4*this.v.length)
        for (i = 0; i<this.v.length;i++) {
          if (i<fluid) {
            this.m.push(-(rand(0.5,1.1)*0.3))
          } else {
            this.m.push((rand(0.5,1.1)*0.3))
          }
        }
      } else {
        this.m = []
        for (let ve of _v) {
          this.m.push(_m);
        }
      }
      this.tip = new Tip(this.v,this.m,this.color,this.calcCenter());
      return this.tip.mask();
    }
    calcCenter () {
      let midx = 0, midy = 0;
      for(let i = 0; i < this.v.length; ++i) {
        midx += this.v[i].x;
        midy += this.v[i].y;
      }
      midx /= this.v.length, midy /= this.v.length; 
      return createVector(midx,midy)
    }
  }

class BgBrush {
  constructor(_initX, _initY, _initA, _initS) {
    this.position = new Pos(_initX,_initY);
    this.angle = 0;
    this.tip = new PaintBrush("watercolor");
    this.c = 0;
  }
  isXIn() {
    return ((this.position.x < w2Active && this.position.x > w1Active));
  }
  isYIn() {
    return ((this.position.y > h1Active && this.position.y < h2Active));
  }
  move (_speed,_size) {
    this.size = _size;
    if (this.isXIn() && this.isYIn()) {
      this.position.moveTo(0.2*this.size*_speed,noise(frameCount)*this.angle);
    } else {
      this.position = new Pos(rand(w1Active,0.4*widthW),rand(h1Active,0.9*h2Active));
      this.angle = rande(-50,50)
      this.c = abs(this.c-1);
    }
  }
  paint (_scale) {
    this.tip.stroke(bgColors[this.c], this.position.x, this.position.y, this.size * _scale * pixel);
  }
}

class BgHatch {
  constructor(_initX, _initY, _initA) {
    this.position = new Pos(_initX, _initY);
    this.angle = _initA;
    this.tip = new LineStyle("2H");
    this.count = 0;
    this.finished = false;
    this.inclin = parseInt(weightedRand({
        45: 50,
        0: 10,
        90: 10,
        315: 5,
    }));
  }
  isIn() {
    return ((this.position.x <= w2Active && this.position.x >= w1Active) && (this.position.y >= h1Active && this.position.y <= h2Active));
  }
  move () {
    if (this.isIn()) {
      this.position.moveTo(5,this.angle)
    }
  }
  draw () {
    if(this.count < 20) {
      this.tip.line(this.position.x,this.position.y,5*pixel,this.inclin,bgPalettes[palette][3],0.5);
    }
    if(!this.isIn() && this.count < 20) {
      this.count++;
    } else if (this.count == 20) {
      this.finished = true;
    }
  }
}

class Tip {
  constructor(_v,_m,_c,_midP,_xpos,_ypos) {
    this.vertices = _v;
    this.modifiers = _m;
    this.color = _c;
    if (!_xpos) {_xpos = 0;} if (!_ypos) {_ypos = 0;}
    this.x = _xpos, this.y = _ypos;
    this.midP = _midP;
    this.size = p5.Vector.sub(this.midP,this.vertices[0]).mag();
  }
  grow (_a) {
    const newVerts = [];
    const newMods = [];
    var vertixlength = this.vertices.length;
    if (_a >= 0.2) {vertixlength = int(_a * this.vertices.length);}
    for (let i = 0; i < vertixlength; i ++) {
      const j = (i + 1) % vertixlength;
      const v1 = this.vertices[i];
      const v2 = this.vertices[j];
      let mod = this.modifiers[i];
      if (i == vertixlength - 1 && _a >= 0.2) {mod = -1;} // TEXTURES
      const chmod = m => {return m + (randomGaussian(0.5,0.1) - 0.5) * 0.1;}
      newVerts.push(v1);
      newMods.push(chmod(mod));
      const segment = p5.Vector.sub(v2, v1);
      const len = segment.mag();
      segment.mult(randomGaussian(0.5,0.2));
      const v = p5.Vector.add(segment, v1);
      segment.rotate(-90 + (randomGaussian(0,0.4)) * 45);
      segment.setMag(randomGaussian(0.5,0.2) * rand(0.6,1.4) * len * mod);
      v.add(segment);
      newVerts.push(v);
      newMods.push(chmod(mod));
    }
    return new Tip(newVerts,newMods,this.color,this.midP,this.x,this.y);
  }
  layer(_nr) {
    // MAIN
    maskBuffer.push();
    maskBuffer.fill(0,255,0);
    maskBuffer.stroke(255,0,0)
    maskBuffer.strokeWeight(map(_nr,0,12,0,5)*1.5*pixel)
    maskBuffer.beginShape();
    for(let v of this.vertices) {
      maskBuffer.vertex(v.x+this.x, v.y+this.y);
    }
    maskBuffer.endShape(CLOSE);
    // BORDER
    maskBuffer.noFill(0,255,0);
    maskBuffer.strokeWeight(2*pixel)
    maskBuffer.beginShape();
    for(let v of this.vertices) {
      maskBuffer.vertex(v.x+this.x, v.y+this.y);
    }
    maskBuffer.endShape(CLOSE);
    maskBuffer.noStroke();
    maskBuffer.pop();
  }
  subtlelayer(_nr) {
    // MAIN
    maskBuffer.fill(0,255,0);
    maskBuffer.noStroke();
    maskBuffer.beginShape();
    for(let v of this.vertices) {
      maskBuffer.vertex(v.x+this.x, v.y+this.y);
    }
    maskBuffer.endShape(CLOSE);
  }
  texture(_i) { 
    // MORE INTENSITY
    maskBuffer.fill(0,0,255,_i);
    maskBuffer.strokeWeight(2*pixel)
    maskBuffer.beginShape();
    for(let v of this.vertices) {
      maskBuffer.vertex(v.x+this.x, v.y+this.y);
    }
    maskBuffer.endShape(CLOSE);
  }
  erase(_i) { 
    // LESS INTENSITY (erase)
    maskBuffer.erase(_i);    
    for(i=0;i<rande(65,95);i++) {
      maskBuffer.ellipse(this.midP.x+rand(-this.size,this.size)*1.3, this.midP.y+rand(-this.size,this.size)*1.3, rand(0.02,0.2)*this.size*pixel);
    }
    maskBuffer.noErase();
  }
  fill(_min,_max) {
    let basePoly = this.grow();
    let basePoly2 = this.grow(0.4);
    let basePoly3 = basePoly2.grow().grow().grow(0.3);
    const numLayers = 10;
    let l = 0;
    for (let i = 0; i < numLayers; i ++) {
      if (i == int(numLayers/4) || i == int(2*numLayers/4) || i == int(3*numLayers/4)) {
        basePoly = basePoly.grow();
        basePoly2 = basePoly2.grow();
        basePoly3 = basePoly3.grow();
      }
      maskBuffer.push();
      basePoly.grow().grow().grow().layer(i);   // Main layer
      basePoly2.grow().grow().grow().grow().texture(60); // Texture dark
      basePoly3.grow().grow().grow().grow().texture(140); // Texture dark
      basePoly2.grow().grow().grow().erase(180);   // Texture light
      if(i%3 == 0){ l = int(i/3)}
      this.noPaint(l,0);  // Erase Shapes
      maskBuffer.pop();
      paintColor(this.color,map(i,0,numLayers,_max,_min),"spot",this.vertices[rande(0,this.vertices.length)],2*this.size); // Run SHADER
    }
  }
  band(_min,_max) {
    let basePoly = this.grow();
    let basePoly2 = this.grow(0.7);
    const numLayers = 4;
    for (let i = 0; i < numLayers; i ++) {
      if (i == numLayers/2) {
        basePoly = basePoly.grow();
        basePoly2 = basePoly2.grow();
      }
      maskBuffer.push();
      basePoly.grow().grow().grow().layer(i);   // Main layer
      basePoly2.grow().grow().grow().grow().texture(100); // Texture dark
      basePoly.grow().grow().grow().erase(100);   // Texture light
      this.noPaint(i,0); // REMOVE FORMS FROM BG
      maskBuffer.pop();
      paintColor(this.color,map(i,0,numLayers,_max,_min),"spot",this.vertices[rande(0,this.vertices.length)],2*this.size); // Run SHADER
    }
  }
  stroke(_min,_max) {
    let basePoly = this.grow(0);
    const numLayers = 4;
    for (let i = 0; i < numLayers; i ++) {
      if (i == numLayers/2) {
        basePoly = basePoly.grow();
      }
        maskBuffer.push();
        basePoly.grow().grow().grow().subtlelayer(i);   // Main layer
        basePoly.grow().grow().grow().erase(100);   // Texture light
        this.noPaint(i); // REMOVE FORMS FROM BG
        maskBuffer.pop();
        paintColor(this.color,map(i,0,numLayers,_max,_min),"simple"); // Run SIMPLE SHADER
    }
  }
  mask() {
    let basePoly = this.grow();
    this.dMask = [];
    const numLayers = 4;
    for (let l = 0; l < numLayers; l ++) {
      if (l == numLayers/2) {
        basePoly = basePoly.grow().grow();
      }
      this.dMask.push(basePoly.grow().grow().grow().vertices);
    }
    return this.dMask;
  }
  noPaint(_l,_mode) {
    maskBuffer.erase();
    for (let d of doodles) {
      let opacity = movement.opacity;
      if (compSel == 1 && fxrand() < 0.45 && d.length == 0) {
        opacity = 0.1;
      }
      if(fxrand() < opacity) {
        maskBuffer.beginShape();
        for (let p of d.bgLayers[_l]) {
          maskBuffer.vertex(p.x,p.y);
        }
        maskBuffer.endShape(CLOSE);
      }
    }
    // REMOVE BORDERS
    if (_mode!==0) {
        for (let bM of borderMask) {
          maskBuffer.beginShape();
          for (let pp of bM[_l]) {  
              maskBuffer.vertex(pp.x,pp.y);
          }
          maskBuffer.endShape(CLOSE);
        }
    }
    // REMOVE CORNERS (CARDS)
    for (let mM of marcoMask) {
      maskBuffer.beginShape();
      for (let mp of mM[_l]) {
        maskBuffer.vertex(mp.x,mp.y);
      }
      maskBuffer.endShape(CLOSE);
    }
    maskBuffer.noErase();
  }
}

let hatchFinished = [false];
function createHatch() {
  let lado = w1Active;
  let sign = 1 - parseInt(weightedRand({0: 50,2: 50,}));
  let angleH = rande(25,45)
  if (fxrand()<0.5) {
    lado = w2Active;
    angleH += 180;
  }
  let nrDiv = rande(15,35);
  let div = (h2Active-h1Active)/nrDiv;
  for (i=0; i<nrDiv; i++) {
      bgHatch.push(new BgHatch(lado,h1Active+i*div,sign*angleH));
  }
  if (fxrand() <= 0.4 || palette == 4) {
      let lado2 = h2Active;
      let angleI = rande(110,150)
      if (fxrand()<0.5) {
        lado = h1Active;
        angleI += 180;
      }
      let div2 = (w2Active-w1Active)/(nrDiv*0.75);
      for (j=0; j<nrDiv*0.75; j++) {
          bgHatch.push(new BgHatch(w1Active+j*div2,h2Active,150));
      }
  }
}

let hBG = 0;

function hatchBG () {
  // HATCHES BUFFER
  hatchBuffer = createGraphics(widthW, heightW);
  hatchBuffer.pixelDensity(pDensity);
  let colorin = color(bgPalettes[palette][4])
  let nr = 400000;
  if(palette >= 4 || mvtSel !== 1) {nr = 80000}
  for (i = 0; i < nr; i++) {
    colorin.setAlpha(int(randomGaussian(100,50)))
    maskBuffer.fill(colorin)
    maskBuffer.noStroke();
    maskBuffer.circle(rand(0,widthW), rand(0,heightW), rand(0.3,1.2)*pixel)
  }
}

function hatchFill (_doodle) {
  hatchBuffer.push();
  hatchBuffer.fill(0,0,0,0)
  hatchBuffer.noStroke()
  hatchBuffer.beginShape()
  for (let v of _doodle.bgLayers[3]) {
    hatchBuffer.vertex(v.x,v.y)
  }
  hatchBuffer.endShape(CLOSE)
  hatchBuffer.drawingContext.clip();
  hatchBuffer.image(maskBuffer,0,0)
  hatchBuffer.pop();
  image(hatchBuffer,0,0,widthW,heightW)
  hatchBuffer.clear();
}

function createBands() {
  let divi = (h2Active-h1Active)/30;
        for (m = 0; m<30; m++) {
            let bandV = [];
            let nrD = rande(1,7.9)
            let mod = rand(0.05,0.12);
            if (m < 2 || m > 28) {
              mod = rand(0.05,0.065);
            }
            bandV.push(createVector(w1Active,h1Active+m*divi))
            for (o = 1; o <= nrD; o++) {
                bandV.push(createVector(w1Active+o*(w2Active-w1Active)/nrD,h1Active+m*divi))
            }
            bandV.push(createVector(w2Active,h1Active+m*divi))
            bandV.push(createVector(w2Active,h1Active+divi+m*divi))
            for (o = 1; o <= nrD; o++) {
                bandV.push(createVector(w2Active-o*(w2Active-w1Active)/nrD,h1Active+divi+m*divi))
            }
            bandV.push(createVector(w1Active,h1Active+divi+m*divi))
            if (mvtSel == 1 && palette == 4) {
              bgBands.push([bandV,mod,bgColors[1]])
            } else {
              bgBands.push([bandV,mod,bgColors[parseInt(weightedRand({0: 40, 1: 30+mvtSel*25}))]])
            }
        }
}

class BgDots {
  constructor (_a) {
    let res_x = (right_x - left_x) / num_columns * pixel, res_y = (bottom_y - top_y) / num_rows * pixel;
    this.bgDots = []
    for (column=0;column<num_columns/2;column++){
      for (row=0;row<num_rows/2;row++) {
        let dtt = new Pos(res_x*column*2,res_y*row*2);
        if (dtt.angle() >= rande(_a,2*_a) || dtt.angle() <= -rande(_a,2*_a)) {
          for (i = 0; i < rande(2,5); i++) {
            dtt.moveTo(3,45);
            this.bgDots.push([dtt.x,dtt.y]);
          }
        }        
      }
    }
    this.bgDots = shuffle(this.bgDots);
    this.i = 0;
  }
  draw () {
      push();
      fill(bgPalettes[palette][3]);
      noStroke();
      for(let o = 0; o<15; o++) {
        if (this.i+o < this.bgDots.length) {
          circle(this.bgDots[this.i+o][0],this.bgDots[this.i+o][1],1*pixel,1*pixel);
        }
      }
      pop();
    this.i+=15;
  }
}

let marco;
switch (compSel) {
  case 0:
    marco = 30*pixel;
    break;
  case 1:
    marco = 25*pixel;
    break;
  case 2:
    marco = 40*pixel;
    break;
}


function borderMasks() {
    borderMask.push(watercolor.genMask(vertRect([w1Active/2-0.2*widthW/2,heightW/2],w1Active+0.2*widthW,heightW,8),0.06));
    borderMask.push(watercolor.genMask(vertRect([w2Active/2+1.2*widthW/2,heightW/2],w1Active+0.2*widthW,heightW,8),0.06));
    borderMask.push(watercolor.genMask(vertRect([widthW/2,h1Active/2-0.2*heightW/2],widthW,h1Active+0.2*heightW,8),0.06));
    borderMask.push(watercolor.genMask(vertRect([widthW/2,h2Active/2+1.2*heightW/2],widthW,h1Active+0.2*heightW,8),0.06));
  if (mvtSel == 2) {
    if (parseFloat(marg) !== 0) {
      console.log("WHY?")
      marcoMask.push(watercolor.genMask(vertRect([(w1Active+marco)/2,(h1Active+marco)/2],(w1Active+marco),(h1Active+marco),8),0.2));
      marcoMask.push(watercolor.genMask(vertRect([(w1Active+marco)/2,heightW-(h1Active+marco)/2],(w1Active+marco),(h1Active+marco),8),0.2));
      marcoMask.push(watercolor.genMask(vertRect([widthW-(w1Active+marco)/2,(h1Active+marco)/2],(w1Active+marco),(h1Active+marco),8),0.2));
      marcoMask.push(watercolor.genMask(vertRect([widthW-(w1Active+marco)/2,heightW-(h1Active+marco)/2],(w1Active+marco),(h1Active+marco),8),0.2));
    }
  }
}

function vertRect (_c,_w,_h,_n1) {
  let v = []
  v.push(createVector(_c[0]-_w/2,_c[1]-_h/2))
  let _n = int(rand(0.5,1)*_n1)
  for (i = 1; i <= _n; i++) {v.push(createVector(_c[0]-_w/2,_c[1]-_h/2+i*_h/_n))}
  _n = int(rand(0.5,1)*_n1)
  for (i = 1; i <= _n; i++) {v.push(createVector(_c[0]-_w/2+i*_w/_n,_c[1]+_h/2))}
  _n = int(rand(0.5,1)*_n1)
  for (i = 1; i <= _n; i++) {v.push(createVector(_c[0]+_w/2,_c[1]+_h/2-i*_h/_n))}
  _n = int(rand(0.5,1)*_n1)
  for (i = 1; i < _n; i++) {v.push(createVector(_c[0]+_w/2-i*_w/_n,_c[1]-_h/2))}
  return v;
}

function drawBorder() {
  if (mvtSel !== 2 || marg == 0) {
    borderLines.line((w1Active-3*pixel),h1Active,(w2Active+3*pixel),h1Active,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active,(h1Active-3*pixel),w1Active,(h2Active+3*pixel),colors[palette][2],0.6,"straight");
    borderLines.line(w2Active,(h1Active-3*pixel),w2Active,(h2Active+3*pixel),colors[palette][2],0.6,"straight");
    borderLines.line((w1Active-3*pixel),h2Active,(w2Active+3*pixel),h2Active,colors[palette][2],0.6,"straight");
  } else {
    borderLines.line((w1Active-3*pixel)+marco,h1Active,(w2Active+3*pixel)-marco,h1Active,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active,(h1Active-3*pixel)+marco,w1Active,(h2Active+3*pixel)-marco,colors[palette][2],0.6,"straight");
    borderLines.line(w2Active,(h1Active-3*pixel)+marco,w2Active,(h2Active+3*pixel)-marco,colors[palette][2],0.6,"straight");
    borderLines.line((w1Active-3*pixel)+marco,h2Active,(w2Active+3*pixel)-marco,h2Active,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active,h1Active+marco,w1Active+marco,h1Active+marco,colors[palette][2],0.6,"straight");
    borderLines.line(w2Active-marco,h1Active+marco,w2Active,h1Active+marco,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active,h2Active-marco,w1Active+marco,h2Active-marco,colors[palette][2],0.6,"straight");
    borderLines.line(w2Active-marco,h2Active-marco,w2Active,h2Active-marco,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active+marco,h1Active,w1Active+marco,h1Active+marco,colors[palette][2],0.6,"straight");
    borderLines.line(w2Active-marco,h1Active,w2Active-marco,h1Active+marco,colors[palette][2],0.6,"straight");
    borderLines.line(w1Active+marco,h2Active,w1Active+marco,h2Active-marco,colors[palette][2],0.6,"straight");
    borderLines.line(w2Active-marco,h2Active,w2Active-marco,h2Active-marco,colors[palette][2],0.6,"straight");
  }
}

function star (_x,_y,_s) {
  for (let i = 0; i < 8; i++) {
    stars.line(_x,_y,_s*pixel,i*45,bgPalettes[palette][3],1.5)
  }
}

let watercolor = new PaintBrush("watercolor");