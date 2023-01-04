// MESSY CODE BY ALEJANDRO - (RAT)CHITECT (@RATCHITECT), RATCHITECT.TEZ, RATCHITECT.ETH
// P5.JS LIBRARY LICENSE: https://p5js.org/copyright.html

// FX(HASH) FEATURES
    window.$fxhashFeatures = {
        "Couleurs": colors[palette][0],
        "Mouvement": movement.name,
        "Version": version.name,
        "Lieu": venue.name,
        "Cass\xE9": bugged,
        "Composition": composition[compSel].name,
    }

// SETUP and DRAW
function setup () {
        // CANVAS AND SEEDS
        mainCanvas = createCanvas(widthW, heightW, WEBGL); angleMode(DEGREES), rectMode(CENTER), noiseSeed(fxrand() * 999999); pixelDensity(pDensity);
        mainCanvas.id('principal');
        // COLOR MIX SHADER and BUFFER
        mixbox.lutTexture();
        // LOAD SOUND FILES
        soundFile = loadSound("././sound/mvt" + mvtSel + "/v" + pianoVersion + "/piano.mp3",finished);
        soundJSON = loadJSON("././sound/mvt" + mvtSel + "/v" + pianoVersion + "/piano.json",finished2);
        // Adjust to WEBGL
        translate(-widthW/2,-heightW/2) 
        // CREATE FLOW FIELD
        createField(ffType)
        // BACKGROUND and paper texture
        background(colors[palette][1]);
        // WATERCOLOR BRUSH BACKGROUND
        if (wac == 1) {bgBrush = new BgBrush(rand(w1Active,w2Active),rand(h1Active,h2Active),rande(0,360))}
        // HATCH BACGROUND
        if (hat == 1) {createHatch();}
        // BAND BACKGROUND
        if (ban == 1 && wac == 1) {createBands();}
        // DOT BACKGROUND
        if (dott == 1) { bgDots = new BgDots(minAngle)}
        // INITIALISE GLOBAL BRUSHES
        gridLines = new LineStyle("HB"), shadowLines = new LineStyle("HB"), borderLines = new LineStyle("2H"), stars = new LineStyle("2B");
        if (mvtSel == 1) {gridLines = new LineStyle("2B")}
        if (palette == 5) {gridLines = new LineStyle("2B")}
        // COMPOSE CANVAS and DISTRIBUTE STROKES
        compose();
        // DRAW BORDER
        if(border == 1) {
            drawBorder();
        }
        let myp5 = new p5(sketch);

        // LOG FEATURES
        console.log("--\nFEATURES")
        console.log("Your hash: " + fxhash)
        console.log("Your 'Enfantillage' dances to the sound of the " + movement.print + " movement, '" + movement.name + "', a special '" + version.name + "' version played by Zazo in " + venue.print + ". This is the '" + colors[palette][0] + "' color palette, the strokes following a beautiful composition type we've called '" + composition[compSel].name + "'.")
        if (bugged) {
            console.log("Moreover, you've been unlucky, since your Enfantines is bugged")
        }
        console.log("--")
}

let l; // loading phases

function draw () {

    // Adjust to WEBGL
    translate(-widthW/2,-heightW/2)
    
    // BACKGROUND AND DOODLES
    if (loaded == 2) {
        // THINGS THAT WE DO ONCE
        if (phase == 0) {
            console.log("--\nLoading...")
            console.log("Phase 0 - Border Masks and Buffer")
            borderMasks(); // CALCULATE BORDER MASKS
            randomSeed(fxrand()*99999);

            // CALCULATE SONG LENGTH and limit values
            notesTrackE = soundJSON.tracks[0].notes.length;
            notesTrackO = soundJSON.tracks[1].notes.length;
            MinMax();

            // CREATE REVERB
            if(venue.reverb !== 0) {
                reverb = new p5.Reverb();
                soundFile.disconnect();
                reverb.process(soundFile, 3, 2);
            }
            
            phase = 0.5;
            l = 0;
        }
        // DOODLE DISTRIBUTE
        else if (phase == 0.5) {
            if (l < doodles.length) {
                doodles[l].distribute(l);
                if (l%2 == 0) {totalElE = totalElE + doodles[l].length;} else {totalElO = totalElO + doodles[l].length;}
                l++;
            }
            else {
                // CREATE MASKBUFFER
                maskBuffer = createGraphics(widthW, heightW);
                maskBuffer.pixelDensity(pDensity);
                maskBuffer.rectMode(CENTER);
                maskBuffer.noStroke();
                l = 0;
                phase = 1;
                console.log("Phase 1 - Background Texture")
            }
        }
        // BG TEXTURE BY STEPS
        else if (phase == 1) {
            phaseMax = 20;
            // NIGHT BACKGROUND for Mvt = 1
            if (l == 20 && mvtSel == 1) {
                if (palette <= 4) {
                    watercolor.fill(vertRect([widthW/2,height/2],widthW,heightW,10),0.1,bgColors[0],1);
                } else {
                    watercolor.fill(vertRect([widthW/2,height/2],widthW-w1Active*2,heightW-h1Active*2,10),0.1,bgColors[0],1);
                }
                let pal = 1; if(palette == 4) {pal=rand(1.5,3.5)}
                for (let s = 0; s < pal*rande(8,20); s++) {
                    star(rand(w1Active,w2Active),rand(h1Active,h2Active),rande(4,15));
                }
            }
            // HORIZON BACKGROUND for Mvt = 2
            else if (l == 20 && mvtSel == 2) {
                let horizon = randomGaussian(0.5, 0.2);
                horizon = map(horizon,0.2,0.8,0.2,0.8,true)
                watercolor.fill(vertRect([widthW/2,horizon*heightW/2+h1Active/2],w2Active-w1Active,horizon*heightW-h1Active,10),0.1,bgColors[0],0.4);
                watercolor.fill(vertRect([widthW/2,h2Active/2+horizon*heightW/2],w2Active-w1Active,h2Active-horizon*heightW,10),0.1,bgColors[1],0.4);
            }
            if (l < 20) {
                phaseCom = l+1;
                bgTexture(l);
                l++
            } else {
                phase = 1.01;
            }
        } 
        // CREATE HATCH BACKGROUND
        else if (phase == 1.01) {
            hatchBG()
            phase = 2;
            l = 0;
            phaseCom = 0;
            console.log("Phase 2 - Doodles Outline")
        }
        // DRAW DOODLES 1 by 1
        else if (phase == 2) {
            phaseMax = doodles.length;
            if (l < doodles.length) {
                phaseCom = l;
                hatchFill(doodles[l]);
                if (doodles[l].length == 0 && fxrand() < 0.25 && compSel == 1) {
                } else {doodles[l].guideLines();}
                l++;
            } else {
                // Clear buffers and remove HatchBuffer
                maskBuffer.clear();
                hatchBuffer.clear();
                hatchBuffer.remove();
                phase = 3;
                phaseCom = 0;
                l = 0;
                console.log("Phase 3 - Watercolor Brush")
            }
        }
        // DRAW WATERCOLOR
        else if (phase == 3) {
                // BACKGROUND
                phaseMax = nrWCmax;
            if (wac == 1) {
                // WATERCOLOR BANDS
                if (nrWC < bgBands.length && ban == 1) {
                    let prob = 0.9;
                    if (mvtSel == 2) {prob = 0.5}
                    if (fxrand() < prob) {
                        watercolor.bgBand(bgBands[nrWC][0],bgBands[nrWC][1],bgBands[nrWC][2])
                    }
                } 
                // WATERCOLOR SPRAY for Mvt = 0
                else if (nrWC < nrWCmax - bgBands.length && nrWC < nrWCmax && mvtSel == 0) {
                    let adjust = 1;
                    if (ban == 0) {adjust = 1.5}
                        if (bgbrush == 1) {
                            bgBrush.move(2,100*adjust);
                            bgBrush.paint(0.5+noise(nrWC/100)*1.5)
                        }
                }
            }
            // DOT BACKGROUND
            if (nrWC > bgBands.length && nrWC%4 == 0 && dott == 1) {
                bgDots.draw();
            }
            nrWC++;
            phaseCom = nrWC;
            if (nrWC >= nrWCmax) {
                phase = 4;
                phaseCom = 0;
                console.log("Phase 4 - Hatch Draw\n--")
            }
        } else if (phase == 4) {
            if (hat == 1 && getOccurrence(hatchFinished,false)!==0) {
                // HATCH
                phaseMax = bgHatch.length;
                for (i=0; i<bgHatch.length; i++) {
                    bgHatch[i].draw();
                    bgHatch[i].move();
                    hatchFinished[i] = bgHatch[i].finished;
                }
                phaseCom = getOccurrence(hatchFinished,true);
            } else { 
                l = 0;
                loaded = 3;
            }
        }
    }

    // Wait to LOAD and then start COUNTDOWN
    if (loaded == 3) {
        frameRate(1);
        l++;
        if (l >= 6) { loaded = 4; mode = "silent"; l = 0;}
    }
    
    // MODES PARAMETERS
    if (loaded == 4) {
        if (mode == "silent") {
            frameRate(60);
            selected = true;
            nrmode = 1+compSel;
            strokeID += nrmode;
            while (conditionSilent()) {
                currentDoodle++;
                strokeID = 0;
            }
        } else if (mode == "music") {
            // REVERB TEST
            if(venue.reverb !== 0) {
                reverb.drywet(venue.reverb);
            }
            frameRate(100/(60000 / (soundJSON.header.tempos[0].bpm * soundJSON.header.ppq)));
            selected = true;
            nrmodeE = totalElE/notesTrackE;
            nrmodeO = totalElO/notesTrackO;
            //if (soundFile.currentTime() >= soundFile.duration()-0.3) { mode = "finished"; }
            while (conditionMusic("even")) {
                currentDoodleEven += 2;
                strokesEven_ID = 0;
            }
            while (conditionMusic("odd")) {
                currentDoodleOdd += 2;
                strokesOdd_ID = 0;
            }
        } else if (mode == "finished") {
            selected = true;
            if (soundFile.isPlaying()) {
                soundFile.stop(10);
                soundFile.setVolume(0, 40);
            }
            fxpreview(), noLoop();
        }

        // DO SOMETHING WITH EMPTY DOODLES ???
        if (empty[0] !== "no") {
            //watercolor.fill(doodles[empty[1]].bg,rand(0.15,0.8),colors[palette][rande(2,7.9)]);
            //doodles[empty[1]].guideLines();
            empty.splice(1,1);
            if (empty.length == 1) {
                empty = ["no"];
            }
        }

        // DRAW STROKES
        if ((conditionD(mode,0) || conditionD(mode,1))) {
            if (mode == "music" && track == 0) {nrmode = nrmodeE} else if (mode == "music" && track == 1) {nrmode = nrmodeO;}
            for (i=0;i<nrmode;i++) {
                if (mode == "silent") {
                    var DrawDoodle = currentDoodle;
                    var DrawStroke = int(strokeID)+i;
                    var multiply = 1;
                }
                else if (mode == "music") {
                    if (track == 0 && currentDoodleEven < doodleNumber) {
                        var DrawDoodle = currentDoodleEven;
                        var DrawStroke = int(strokesEven_ID)+i;
                    }
                    else if (track == 1 && currentDoodleOdd < doodleNumber) {
                        var DrawDoodle = currentDoodleOdd;
                        var DrawStroke = int(strokesOdd_ID)+i;
                    } else {DrawDoodle = false}
                        var multiply = (map(noteVelocity,velMaxMin[0],velMaxMin[1],0.5,1.2));
                        var pitch = Math.floor(map(notePitch,midiMaxMin[0],midiMaxMin[1],0,5.9,true));
                        var durationSize = (map(noteDuration,durMaxMin[0],durMaxMin[1],1,3,true));
                }
                if (DrawDoodle !== false) {
                    var att = doodles[DrawDoodle].elements[DrawStroke]; 
                    var strand = rande(0,DrawStroke-2);
                    var numEls = doodles[DrawDoodle].elements.length;
                    // SPECIALS BEFORE STROKES
                    if (DrawStroke == 0) {

                        if (mode == "music") {
                            //fireOscillator(rande(0,3.99),0.9,rande(6,15));
                        }
                        
                        push();
                        let colorSpecial = color(colors[palette][1]);
                        noStroke();
                        switch(compSel) {
                            case 0: case 1: // Superimpose for Duet
                                colorSpecial.setAlpha(15);
                                fill(colorSpecial)
                                beginShape();
                                for (let d of doodles[DrawDoodle].bg) {
                                    //vertex(d.x,d.y);
                                }
                                endShape(CLOSE);
                                pop();
                            break;
                        }
                    }

                    // SHADOW MODE
                    if (att && shadow == 1) {
                        shadowLines.line(att[1],att[2],0.6*att[3],45,colors[palette][2],att[6])
                    }
                    // DRAW STROKE
                    if(mode == "music") {
                        att[5] = colors[palette][noteColors[pitch]]; 
                        att[6] = durationSize;
                    }
                    var brushStyle = new LineStyle(att[0]);
                    brushStyle.line(att[1],att[2],multiply*att[3],att[4],att[5],att[6]);
                    // BUGGED MODE
                    if (bugged) {
                        try {shadowLines.line(att[1],att[2],doodles[DrawDoodle].elements[strand][1],doodles[DrawDoodle].elements[strand][2],att[5],att[6],"straight");} catch {}
                    }
                    // REDRAW CONTOUR AFTER STROKES
                    if (DrawStroke == numEls-nrmode-1) {
                        if (doodles[DrawDoodle].plot.doodle !== "butterfly" && doodles[DrawDoodle].plot.doodle !== "owl") {
                            doodles[DrawDoodle].guideLines();
                        }
                    }             
                }
            }
            if (track == 0) {noteParDone ++; strokesEven_ID = strokesEven_ID + nrmodeE;}
            else {noteImparDone ++; strokesOdd_ID = strokesOdd_ID + nrmodeO;}
        }
        else if (currentDoodleEven >= doodles.length && currentDoodleOdd >= doodles.length) { mode = "finished";}
        else if (mode == "silent") { mode = "finished"; }
    }
}

// DRAW CONDITION for Even, Odd Cols, following music beats. The note tones, times and durations are stored in satie.js.

    function conditionSilent() {
        if (currentDoodle < doodles.length) {
            if (doodles[currentDoodle].length < nrmode) {empty[0] = ["yes"]; empty.push(currentDoodle);}
            return strokeID + nrmode >= doodles[currentDoodle].length}
            else {return false}
    }

    function conditionMusic(_which) {
        switch (_which) {
            case "even": if (currentDoodleEven < doodleNumber) {
                if (doodles[currentDoodleEven].length < nrmode) {empty[0] = ["yes"]; empty.push(currentDoodleEven);}
                return strokesEven_ID + nrmodeE >= doodles[currentDoodleEven].length} else {return false}
            case "odd": if (currentDoodleOdd < doodleNumber) {
                if (doodles[currentDoodleOdd].length < nrmode) {empty[0] = ["yes"]; empty.push(currentDoodleOdd);}
                return strokesOdd_ID + nrmodeO >= doodles[currentDoodleOdd].length} else {return false}
        }
    }

    function conditionD(mode2,trac) {
        track = trac;
        switch(mode2) {
            case "music":
                if (track == 0) { noteDone = noteParDone; nrmode = nrmodeE; } 
                else {noteDone = noteImparDone; nrmode = nrmodeO;}

                if (noteDone < soundJSON.tracks[track].notes.length) {
                    noteVelocity = soundJSON.tracks[track].notes[noteDone].velocity;
                    notePitch = soundJSON.tracks[track].notes[noteDone].midi;
                    noteDuration = soundJSON.tracks[track].notes[noteDone].duration;
                    return soundJSON.tracks[track].notes[noteDone].time < soundFile.currentTime()+0.1;
                }
                else {return false;}
            case "silent":
                return currentDoodle < doodles.length;
        }
    }

// INTERACTIVITY
    function mousePressed() {if(loaded >= 3) {doubletap(false);return false;}}
    function touchStarted() {if(loaded >= 3) {doubletap(true);return false;}}
    function mouseDragged() {return false;}
    var mylatesttap;
    function doubletap(touchmode) {
        var now = new Date().getTime();
        var timesince = now - mylatesttap;
        if((timesince < 400) && (timesince > 0)){
            if (loaded == 3) {
                if (!selected) {
                    loaded = 4
                    mode = "music";
                    soundFile.play(3);
                    selected = true;
                }
                else if (touchmode) {
                    saveCanvas(fxhash, 'png');
                }
            }
        }else{
            if (isLooping() && mode == "silent") {
                noLoop();
            } else if (mode == "silent") { loop(); }
    
            if (soundFile.isPlaying() && mode == "music") {
                soundFile.pause();
            } else if (mode == "music") {
                soundFile.play(0);
            }
        }
        mylatesttap = new Date().getTime();
    }
    function keyReleased(){
        if (keyCode === 83) {
            saveCanvas("ENF-II-" + fxhash, 'png');
        }   
        else if (keyCode === 77 && !selected && loaded == 3) {
            loaded = 4;
            soundFile.play(3);
            mode = "music";
            console.log("--\n'Enfantillages Pittoresques' by Erik Satie. Movement: '" + movement.name + "'.");
            selected = true;
        }
    }
    function finalizar () {
        mode == "finished"
    }