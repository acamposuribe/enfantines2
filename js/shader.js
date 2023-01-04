// THIS SHADER SOLVES THE COLOR-BLENDING PROBLEM WITH MIXBOX

let mainCanvas;
let colorBuffer;
let colorShader;
let mixboxTexture;

let vert = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vVertTexCoord;

void main(void) {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vVertTexCoord = aTexCoord;
}
`

let main = `
precision highp float;
varying vec2 vVertTexCoord;

//#define MIXBOX_COLORSPACE_LINEAR

uniform sampler2D source;
uniform sampler2D mask;
uniform sampler2D mixbox_lut;
uniform vec4 addColor;
uniform vec2 spotBorder;
uniform vec2 spotSize;
uniform float noiseSeed;
uniform float intensity;

#include "mixbox.glsl"

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {

    float desfase = sqrt((vVertTexCoord.x-spotBorder.x)*(vVertTexCoord.x-spotBorder.x)+(vVertTexCoord.y-spotBorder.y)*(vVertTexCoord.y-spotBorder.y));
    float relativeDf = 0.3*desfase/spotSize.x;

    vec4 maskColor = texture2D(mask, vVertTexCoord);
    vec4 inColor = texture2D(source, vVertTexCoord);
    vec3 existingColor = vec3(inColor.r,inColor.g,inColor.b);
    vec3 colorToAdd = rgb(addColor.r,addColor.g,addColor.b);
  
    if (maskColor.g > 0.0) { 
      if (maskColor.b > 0.0) {
        float t = (maskColor.a)*intensity + 2.0*(maskColor.b)*intensity + 0.1*intensity*fract(noiseSeed + rand(vVertTexCoord * 3324.5833));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
        gl_FragColor = vec4(finalColor,1.0);
      }
      else {
        float t = (maskColor.a)*intensity*0.8 + 0.15*intensity*fract(noiseSeed + rand(vVertTexCoord * 1234.5678));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t*(1.0-relativeDf));
        gl_FragColor = vec4(finalColor,1.0);
      }
    }
    else if (maskColor.r > 0.0) {
      float fracc = (1.0-maskColor.a);
      float t = (1.0+fracc)*intensity*0.4;
      vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, 2.0*t*(1.0-relativeDf));
      gl_FragColor = vec4(finalColor,1.0);
    }
    else {
      gl_FragColor = vec4(existingColor,1.0);
    }
}
`
main = main.replace('#include "mixbox.glsl"', mixbox.glsl());

// SIMPLE

let simple = `
precision highp float;
varying vec2 vVertTexCoord;

//#define MIXBOX_COLORSPACE_LINEAR

uniform sampler2D source;
uniform sampler2D mask;
uniform sampler2D mixbox_lut;
uniform vec4 addColor;
uniform float noiseSeed;
uniform float intensity;

#include "mixbox.glsl"

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vec4 maskColor = texture2D(mask, vVertTexCoord);
    vec4 inColor = texture2D(source, vVertTexCoord);
    vec3 existingColor = vec3(inColor.r,inColor.g,inColor.b);
    vec3 colorToAdd = rgb(addColor.r,addColor.g,addColor.b);
  
    if (maskColor.g > 0.0) { 
      if (maskColor.b > 0.0) {
        float t = (maskColor.a)*intensity + 1.2*(maskColor.b)*intensity + 0.1*intensity*fract(noiseSeed + rand(vVertTexCoord * 3324.5833));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
        gl_FragColor = vec4(finalColor,1.0);
      }
      else {
        float t = (maskColor.a)*intensity*0.6 + 0.15*intensity*fract(noiseSeed + rand(vVertTexCoord * 1234.5678));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
        gl_FragColor = vec4(finalColor,1.0);
      }
    }
    else if (maskColor.r > 0.0) {
      float fracc = (1.0-maskColor.a);
      float t = (1.0+fracc)*intensity*0.4;
      vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, 3.0*t);
      gl_FragColor = vec4(finalColor,1.0);
    }
    else {
      gl_FragColor = vec4(existingColor,1.0);
    }
}
`
simple = simple.replace('#include "mixbox.glsl"', mixbox.glsl());

// MARKER SHADER

let markerS = `
precision highp float;
varying vec2 vVertTexCoord;

//#define MIXBOX_COLORSPACE_LINEAR

uniform sampler2D source;
uniform sampler2D mask;
uniform sampler2D mixbox_lut;
uniform vec4 addColor;
uniform float noiseSeed;
uniform float intensity;

#include "mixbox.glsl"

vec3 rgb(float r, float g, float b){
  return vec3(r / 255.0, g / 255.0, b / 255.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vec4 maskColor = texture2D(mask, vVertTexCoord);
    vec4 inColor = texture2D(source, vVertTexCoord);
    vec3 existingColor = vec3(inColor.r,inColor.g,inColor.b);
    vec3 colorToAdd = rgb(addColor.r,addColor.g,addColor.b);
    
  
    if (maskColor.g > 0.0) { 
      if (maskColor.b > 0.0) {
        float t = intensity + 2.0*(maskColor.b)*intensity + 0.1*intensity*fract(noiseSeed + rand(vVertTexCoord * 3324.5833));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
        gl_FragColor = vec4(finalColor,1.0);
      }
      else {
        float t = intensity + 0.15*intensity*fract(noiseSeed + rand(vVertTexCoord * 1234.5678));
        vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
        gl_FragColor = vec4(finalColor,1.0);
      }
    }
    else if (maskColor.r > 0.0) {
      float fracc = (1.0-maskColor.a);
      float t = (1.0+fracc)*intensity;
      vec3 finalColor = mixbox_lerp(existingColor, colorToAdd, t);
      gl_FragColor = vec4(finalColor,1.0);
    }
    else {
      gl_FragColor = vec4(existingColor,1.0);
    }

}
`
markerS = markerS.replace('#include "mixbox.glsl"', mixbox.glsl());

// COLOR MIXING SHADER
let i0 = 0, i1 = 0, i2 = 0;
function paintColor (_c,_i,_m,_o,_s) {
  let normalColor = [float(red(color(_c))),float(green(color(_c))),float(blue(color(_c))),50];
  push();
  noStroke();
  if (_m == "marker") {
    if (i0 == 0) {
        markerShader = createShader(vert, markerS);
        i0++
    }
    shader(markerShader);
    markerShader.setUniform('intensity', _i);
    markerShader.setUniform('addColor', normalColor);
    markerShader.setUniform('mixbox_lut', mixboxTexture);
    markerShader.setUniform('source', mainCanvas);
    markerShader.setUniform('noiseSeed', 999*fxrand());
    markerShader.setUniform('mask', maskBuffer);
  } else if (_m == "simple") {
    if (i1 == 0) {
      simpleShader = createShader(vert, simple);
      i1++
  }
    shader(simpleShader);
    simpleShader.setUniform('intensity', _i);
    simpleShader.setUniform('addColor', normalColor);
    simpleShader.setUniform('mixbox_lut', mixboxTexture);
    simpleShader.setUniform('source', mainCanvas);
    simpleShader.setUniform('noiseSeed', 999*fxrand());
    simpleShader.setUniform('mask', maskBuffer);
  } else { 
    if (i2 == 0) {
      colorShader = createShader(vert, main);
      i2++
  }
    shader(colorShader);
    _o = [_o.x/widthW,_o.y/heightW];
    _s = [_s/widthW,_s/heightW]; 
    colorShader.setUniform('spotBorder', _o);
    colorShader.setUniform('spotSize', _s);
    colorShader.setUniform('intensity', _i);
    colorShader.setUniform('addColor', normalColor);
    colorShader.setUniform('mixbox_lut', mixboxTexture);
    colorShader.setUniform('source', mainCanvas);
    colorShader.setUniform('noiseSeed', 999*fxrand());
    colorShader.setUniform('mask', maskBuffer);
  }
  rect(widthW/2, heightW/2, widthW, heightW);
  maskBuffer.clear();
  pop();
}