// GLOBAL VARIABLES
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;

const src = [`./sources/vSource.glsl`, `./sources/fSource.glsl`];
const sources = [];

const vsSource = `
precision mediump float;

attribute vec3 pos;
attribute vec2 vtexture;

uniform mat4 p;
uniform mat4 v;
uniform mat4 m;
uniform vec2 offset;
attribute vec3 color;
varying vec2 fragtexture;
varying vec3 fColor;
void main()
{
    fColor = color;
    float w = 1.0;
    gl_Position = p * v * m * vec4(
        pos.x + offset.x,
        pos.y + offset.y,
        0.0,
        w
    );
    gl_PointSize = 10.0;
    fragtexture = vtexture;
}`

const fsSource = `
precision mediump float;

varying vec2 fragtexture;
uniform sampler2D fragSampler;
varying vec3 fColor;
void main()
{
    gl_FragColor = texture2D(fragSampler, fragtexture);     
}`
// enemy Data
let vRange = 0.05;
let z = 0;
const eData = [
    //  x,      y,      z
    vRange, vRange, z,
    vRange, -vRange, z,
    -vRange, -vRange, z,
    -vRange, vRange, z
];
// plane Data

function planeData(v) {
    const vRange = v * 1.5;
    const x = vRange * sin(30 * PI / 180);
    const y = vRange * cos(30 * PI / 180);

    return ([
        // x   y
        -x, -y, z,
        vRange, 0, z,
        0, 0, z,         
        -x, y, z
    ]);
};
vRange *= 1.5;
const pData = [
    //  x,      y,      z
    vRange, vRange, z,
    vRange, -vRange, z,
    -vRange, -vRange, z,
    -vRange, vRange, z
];;
console.log(`pData: ${pData.length}`);

// const data = [
//     //  x,      y,      z
//     vRange, vRange, this.z,
//     vRange, -vRange, this.z,
//     -vRange, -vRange, this.z,
//     -vRange, vRange, this.z
// ];
async function load(src) {
    const res = await fetch(src);
    const resTXT = await res.text();
    return (resTXT);
}

function test() {
    src.forEach((element) => {
        load(element).then((output) => { 
            sources.push(output);
        });
    });
}

sources.push(vsSource, fsSource);


export { sources, eData, pData };