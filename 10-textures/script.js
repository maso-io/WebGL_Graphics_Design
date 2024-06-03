import { shaderSource, initBuffer, initProgram, loadShader } from "./funcDef.js";
// start main program 
const canvas = document.querySelector(`#canva`);
const webgl = canvas.getContext(`webgl`);

const vsSource = shaderSource("fSource.glsl");
const fsSource = shaderSource("vSource.glsl");
console.log(vsSource);
if (!webgl){
    throw new Error(`WebGL not supported`);
}
const program = initProgram(webgl, vsSource, fsSource);

const vertices = [
    // front square
    v, v, v,
    v, -v, v,
    -v, -v, v,
    -v, v, v,

    // back square
    v, v, -v,
    v, -v, -v,
    -v, -v, -v,
    -v, v, -v
]