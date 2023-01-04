// CANVAS SIZE and MARGINS
    // Canvas proportion
    let canvasProp = 1.1;
    // Standard PixelDensity
    let pDensity = 2;
    // Get "res" from URL for HQ Canvas
    if (new URLSearchParams(window.location.search).get('pixelDensity')) {pDensity = parseFloat(new URLSearchParams(window.location.search).get('pixelDensity'));}
    let widthW, heightW, pixel;
    // Landscape of Portrait Browser Window. Let Pixel allows for same result in varying screen sizes
    if (pDensity !== 171) {
        if(window.innerHeight <= window.innerWidth*canvasProp) {
            heightW = window.innerHeight;
            pixel = (heightW/704);
            widthW = (heightW/canvasProp);
        } else {
            widthW = window.innerWidth;
            heightW = (widthW*canvasProp);
            pixel = (heightW/704);
        }
    }
    else {
        heightW = window.innerHeight;
        pixel = (heightW/704);
        widthW = window.innerWidth;
        pDensity = 2;
    }
    // Margins
    let marg = weightedRand({0.07: 40, 0.09: 20, 0.12: 10, 0: 20});
    let margin = (widthW * marg);
    let w1Active = margin, w2Active = (widthW - margin), h1Active = margin, h2Active = (heightW - margin);

// AUXILIARY RAND FUNCTIONS
function rand(e, r) {return mapRange(fxrand(), 0, 1, e, r)}
function rande(e, r) {return Math.floor(mapRange(fxrand(), 0, 1, e, r))}
function weightedRand(e) {
    var r, a, n = [];
    for (r in e)
        for (a = 0; a < 10 * e[r]; a++)
            n.push(r);
        return n[Math.floor(fxrand() * n.length)]
}
function createNCarray (n) {
    colorArray = []
    for (i=0;i<6;i++) {
        if (n+i > 7) {colorArray.push(n+i-6)}
        else {colorArray.push(n+i)}
    }
    return colorArray;
}

function mapRange (value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}

// SHUFFLE ARRAY
function shuffler(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(fxrand() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// OCCURRENCE
function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => (v === value && count++));
    return count;
}

// DETECT BROWSER
let userAgentString = navigator.userAgent;
let chromeAgent = userAgentString.indexOf("Chrome") > -1;
let safariAgent = userAgentString.indexOf("Safari") > -1;
if ((chromeAgent) && (safariAgent)) safariAgent = false;