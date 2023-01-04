// SOUND and DRAWING MODES
let soundFile, myFont, noteDone = 0, noteParDone = 0, noteImparDone = 0, strokeID = 0, strokesEven_ID = 0, strokesOdd_ID = 0, mode, nrmode, nrmodeE, nrmodeO, track, noteVelocity, notePitch, piece, selected, soundJSON, reverb;
let firstNoteColor = Math.floor(2+5.9*fxrand()); let noteColors = createNCarray(firstNoteColor);
function preload() {}

// DRAW CONDITION
let currentDoodle = 0, currentDoodleEven = 0, currentDoodleOdd = 1, notesTrackE, notesTrackO;

// WRITE LYRICS. Lyrycs are stored in satie.js
let lyricDone = 0; used = [0,0];

function writeLyrics(second,x,y) {
    var adjustment = 0;
    if (pianoPlayer == 0) { adjustement = 0.9}
    if (lyricDone<lyrics.length) {
        if (lyrics[lyricDone][0+pianoPlayer] - adjustment < second) {
            if (ffType == "partiture" || ffType == "tilted") {
                push(), noStroke(), textSize(7*pixel), textAlign(LEFT, CENTER), textFont(myFont), fill(colors[palette][2]);
                var pX = x;
                if (x <= 10*pixel) {var pX = 10*pixel;}
                var pY = y+17*pixel-lyrics[lyricDone][3]*pixel;
                if (pX <= used[0] && pY == used[1]) { pX = used[0]}
                var pXright = pX+textWidth(lyrics[lyricDone][2])+8*pixel;
                if (pXright <= height-10*pixel) {
                    text(lyrics[lyricDone][2],pX,pY)
                    used = [pXright,pY]
                }
                pop();
            }
            console.log(lyrics[lyricDone][2]);
            lyricDone ++;
        }
    }
}

let lyrics = [
    [0,1.5,"I. Le Chant Guerrier Du Roi Des Haricots",9],
    [1.3,3.4,"Quel roi jovial !",0],
    [4.4,7.25,"Sa figure est toute rouge.",0],
    [7.75,10.25,"Il sait danser lui-m\xEAme.",0],
    [11,13.6,"Son nez est couvert de poils.",0],
    [14.25,17.1,"Il se tape sur le ventre.",0],
    [20.8,24,"Quand il rit, il en a pour une heure.",0],
    [24.2,27.4,"Quel bon roi !",0],
    [27.2,31,"C'est un grand guerrier.",0],
    [31,34.7,"Il faut le voir \xE0 cheval.",0],
    [34.3,38.16,"Il porte un chapeau rouge.",0],
    [37.2,41.1,"Son cheval sait danser lui-m\xEAme.",0],
    [43.6,48,"Il donne des fortes claques \xE0 son cheval.",0],
    [50.16,54.8,"C'est un brave cheval !",0],
    [53.5,58.25,"Aussi aime-t-il la guerre et les boulets.",0],
    [59.75,65,"Quel beau cheval !",0],
    [60,67,"",0],

    [66,70,"II. Ce Que Dit La Petite Princesse Des Tulipes",9],
    [66.3,73.2,"J'aime beaucoup la soupe aux choux,",0],
    [76.5,83.7,"Mais j'aime encore mieux ma petite maman.",0],
    [86.7,94.5,"Parlons bas, car ma poup\xE9e a mal \xE0 la t\xEAte :",0],
    [95.2,103.7,"Elle est tomb\xE9e du 3e \xE9tage.",0],
    [100.4,109.7,"Le docteur dit que ce n'est rien.",0],
    [102,112,"",0],

    [107.5,116,"III. Valse Du Chocolat Aux Amandes",9],
    [108,120,"Tu vas en avoir un peu.",0],
    [118.3,130.2,"Tu aimes le chocolat ?",0],
    [121.75,133.64,"Laisse-le fondre dans la bouche.",0],
    [128.4,140.5,"Maman, il y a un os.",0],
    [131.5,143.75,"Non, mon petit : c'est une amande.",0],
    [137.2,159.2,"Le petit gar\xE7on veut manger toute la bo\xEEte.",0],
    [144,156,"Comme il est gourmand !",0],
    [150.7,162.8,"Sa maman lui refuse doucement :\nil ne faut pas qu'il se rende malade.",0],
    [159.1,171.4,"Horreur : il tr\xE9pigne de colère.",0],
]

let midiMaxMin = [999,0]
let velMaxMin = [999,0]
let durMaxMin = [999,0]
function MinMax() {
    for (i = 0; i < 2; i++) {
        for (j = 0; j < soundJSON.tracks[i].notes.length; j++) {
            midiMaxMin = [Math.min(soundJSON.tracks[i].notes[j].midi,midiMaxMin[0]),Math.max(soundJSON.tracks[i].notes[j].midi,midiMaxMin[1])]
            velMaxMin = [Math.min(soundJSON.tracks[i].notes[j].velocity,velMaxMin[0]),Math.max(soundJSON.tracks[i].notes[j].velocity,velMaxMin[1])]
            durMaxMin = [Math.min(soundJSON.tracks[i].notes[j].duration,durMaxMin[0]),Math.max(soundJSON.tracks[i].notes[j].duration,durMaxMin[1])]
        }
    }
}