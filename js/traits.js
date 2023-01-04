// MOVEMENT and PIANO PLAYER
const movements = [
    {
        name: "Petit pr\xE9lude \xE0 la journ\xE9e",
        color_intensity: 120, // Watercolor Intensity
        opacity: 0.9,   // Shapes Opacity
        probability: 30,
        print: "first"
    },
    {
        name: "Berceuse",
        color_intensity: 120,   // Watercolor Intensity
        opacity: 0.55,   // Shapes Opacity
        probability: 30,
        print: "second"
    },
    {
        name: "Marche du grand escalier",
        color_intensity: 120,   // Watercolor Intensity
        opacity: 0.9,   // Shapes Opacity
        probability: 15,
        print: "third"
    }
]
const mvtSel = parseInt(weightedRand({0: movements[0].probability, 1: movements[1].probability, 2: movements[2].probability}));
const movement = movements[mvtSel];
const nrWCmax = movement.color_intensity;

// PIANO VERSIONS
const versions = [
    {
        name: "Parfait",
        probability: 30,
    },
    {
        name: "Normal",
        probability: 40,
    },
    {
        name: "Nuances Dynamique",
        probability: 20,
    },
    {
        name: "Accords",
        probability: 5,
    },
    {
        name: "Sautillante",
        probability: 5,
    },
]
const pianoVersion = parseInt(weightedRand({0: versions[0].probability,1: versions[1].probability,2: versions[2].probability,3: versions[3].probability,4: versions[4].probability,}));
const version = versions[pianoVersion];

// COLOR PALETTES
let palette = parseInt(weightedRand({
    0: 60,     // Blac Ivoire
    1: 100,    // Outremer Gris
    2: 40,     // Gris Clair
    3: 70,     // Le Rubis
    4: 0,     // Playgrounds
    5: 20,     // BLeU
    6: 45,     // Bleu Outremer Foncé
    7: 15,     // Noir d'Ivoire
}));

if (parseFloat(marg) == 0 && palette == 5) {
    palette = 1;
}
const colors = [
    // Nombre,                  color1,     color2,          color3,        color4,         color5,         color6,        color7 
    ["Blanc Ivoire",            "#fffceb",  "#2c695a",      "#4ad6af",      "#7facc6",      "#4e93cc",      "#f6684f",      "#ffd300"],
    ["Outremer Gris",           "#e2e7dc",  "#7b4800",      "#002185",      "#003c32",      "#fcd300",      "#ff2702",      "#6b9404"],
    ["Gris Clair",              "#ccccc6",  "#474238",      "#f4bd48",      "#9c2128",      "#395a8e",      "#7facc6",      "#2c695a"],   
    ["Le Rubis",                "#ffe6d4",  "#6c2b3b",      "#c76282",      "#445e87",      "#003c32",      "#e0b411",      "#c8491b"],
    ["Playgrounds",             "#c49a70",  "#4e0042",      "#002185",      "#076d16",      "#feec00",      "#ff6900",      "#ff2702"],
    ["Bleu Outremer",           "#4e6498",  "#cdd3e3",      "#c6353c",      "#f6684f",      "#fcd300",      "#488b6d",      "#7fb4b5"],   
    ["Bleu Outremer Fonc\xE9",  "#0e2d58",  "#f4f4f4",      "#c8c9ca",      "#939598",      "#616568",      "#0e1318",      "#080f15"],
    ["Noir d'Ivoire",           "#080f15",  "#C8C1B7",      "#d7d7d7",      "#b0b0b0",      "#8b8b8b",      "#676767",      "#464646"],
];
const escal = rande(3,5.9);
const bgPalettes = [
    // PRELUDE            // BERCEUSE - OK        // ESCALIER                                   // HATCH+STARS // TIZA
    [["#fffceb","#2c695a"],["#0c2f3b","#fffceb"],[colors[palette][escal],colors[palette][escal+2]],"#2c695a","#ffffff"],    // BLANC IVOIRE
    [["#e2e7dc","#7b4800"],["#000a27","#e2e7dc"],[colors[palette][escal],colors[palette][escal+2]],"#7b4800","#ffffff"],    // OUTREMER GRIS  
    [["#ccccc6","#f4b631"],["#0e1318","#ccccc6"],[colors[palette][escal],colors[palette][escal+2]],"#2e4873","#ffffff"],    // GRIS CLAIR 
    [["#ffe6d4","#f4b631"],["#37132D","#003c32"],[colors[palette][escal],colors[palette][escal+2]],"#003c32","#fffceb"],    // LE RUBIS   
    [["#c49a70","#ffffff"],["#8b8b8b","#000000"],[colors[palette][escal],colors[palette][escal+2]],"#fffceb","#000000"],    // PLAYGROUNDS 
    [["#cdd3e3","#ffffff"],["#000000","#000000"],[colors[palette][escal],colors[palette][escal+2]],"#ffb7aa","#ffffff"],    // BLEU 
    [["#0e2d58","#ffffff"],["#0e1318","#000000"],[colors[palette][escal],colors[palette][escal+2]],"#69b5e0","#ffffff"],    // BLEU OUTREMER 
    [["#b0b0b0","#ffb7aa"],["#080f15","#b0b0b0"],[colors[palette][escal],colors[palette][escal+2]],"#d7d7d7","#ffffff"]     // NOIR D'IVOIRE
]
const bgColors = bgPalettes[palette][mvtSel];
let gridColor = colors[palette][2];

// CANVAS COMPOSITIONS
const composition = [
    { 
        name: "Ensemble",
        probability: 80,
        field: [10,8,15,15,20,5,15,5],
        rainbow: 10,
        selective: 15,
        bugged: 1
    },
    { 
        name: "Tears in the Rain",
        probability: 10,
        field: [5,10,15,15,15,0,15,0],
        rainbow: 35,
        selective: 40,
        bugged: 3
    },
    { 
        name: "Duet",
        probability: 10,
        field: [0,12,15,15,20,5,15,0],
        rainbow: 10,
        selective: 10,
        bugged: 2
    }
];
let compSel = parseInt(weightedRand({
    0: composition[0].probability,
    1: composition[1].probability,
    2: composition[2].probability
})); 

// FLOW FIELD SELECTION
const ffTypes = [
    ["curved",1.05],
    ["truncated",1.1],
    ["tilted",1.05],
    ["zigzag",1],
    ["waves",1.08],
    ["scales",1.20],
    ["seabed",1.08],
    ["partiture",1],
];
let ffSel = parseInt(weightedRand({
    0: composition[compSel].field[0],  // curved
    1: composition[compSel].field[1],  // truncated
    2: composition[compSel].field[2],  // tilted
    3: composition[compSel].field[3],  // zigzag
    4: composition[compSel].field[4],  // waves
    5: composition[compSel].field[5],   // scales
    6: composition[compSel].field[6],  // seabed
    7: composition[compSel].field[7],  // partiture
}));
let ffType = ffTypes[ffSel][0];

// DISTRIBUTIONS
let typeDistributions = [
    [0,1,2],
    [2,1,0],
    [0,2,1],
    [1,1,1],
    [2,2,2],
];
let typeSelect = parseInt(weightedRand({
    0: 40,
    1: 30,
    2: 10,
    3: 15,
    4: 10,
}));
let typeDist = typeDistributions[typeSelect];

// SPECIAL TRAITS
// SuperOrder = ordered strokes
// 0 = Random. 1 = Strokes in Even positions. 2 = Ordered strokes every 5 positions.
let superOrder = parseInt(weightedRand({0: 75, 1: 15, 2: 5}));
// Caffeine = More and Bigger Strokes
let caffeine = parseInt(weightedRand({0: 95,1: 5}));
if(superOrder > 0) {caffeine = 0;}
// Selective = Strokes of single brush type.
let selective = parseInt(weightedRand({0: 75,1: composition[compSel].selective}));
// 0 = Random colors. 1 = Groups of Colours. 2 = Doodle Gradient of Colours. 3 = Color per doodle, random.
const rainbow = parseInt(weightedRand({0: 55, 1: 40, 2: 10, 3: composition[compSel].rainbow}));
// Bug Mode = bugged strokes
let bugged = parseInt(weightedRand({0: 100, 1: composition[compSel].bugged}));
if (bugged == 1) {
    bugged = true
} else { bugged = false}
// Shadow mode
const shadow = parseInt(weightedRand({0: 90, 1: 10}));
// Print borders
let border = parseInt(weightedRand({0: 40, 1: 80}));
if (mvtSel == 1) {border = 1;}

// BACKGROUND Types
// Watercolor
const wac = parseInt(weightedRand({0: 10, 1: 90}));
// Hatch
let hat = parseInt(weightedRand({0: 5, 1: 95}));
// BgBrush
const bgbrush= parseInt(weightedRand({0: 15, 1: 85}));
// Bands
let ban = parseInt(weightedRand({0: 2, 1: 98}));
// Dots
let dott = 0;
if (wac == 0) {
    hat = 1;
    dott = 1;
    border = 1;
}

// GENERATIVE SOUND TRAITS
const venues = [
    {
        name: "House",
        reverb: 0,
        probability: 97,
        print: "his Home Piano"
    },
    {
        name: "Concert Hall",
        reverb: 0.4,
        probability: 3,
        print: "a Concert Hall"
    }
];
const venue = venues[parseInt(weightedRand({0: venues[0].probability, 1: venues[1].probability}))];

// BRUSHES Types
let styles = ["pen","2B","HB","2H","cpencil","spray","rotring","marker","charcoal"]
let selectiveStyles = ["pen","cpencil","charcoal","marker"]
let selectiveStylesB = ["pen","cpencil","2B","marker"]
// PALETTE ADJUSTMENTS
if (palette == 4) {selective = 1;ban = 0; dott = 1; hat = 1}
if (palette == 5) {selectiveStylesB = ["pen","cpencil","2B","charcoal"]; border = 1;}
if (mvtSel == 1) {
    styles = ["pen","2B","marker","2B","charcoal","spray","rotring","marker","charcoal"]
}
if (palette >= 5) {styles = ["pen","2B","HB","2H","charcoal","charcoal","cpencil","spray","rotring"]; selectiveStyles = ["pen","cpencil","charcoal","2B"]}