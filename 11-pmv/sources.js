import { test,getColor } from "./functionality.js";

// DEFINE GLOBAL CONSTANTS
const PI = Math.PI;
const cos = Math.cos;
const sin = Math.sin;

const vsSource = `
precision mediump float;

attribute vec3 pos;
attribute vec3 color;

uniform mat4 p;
uniform mat4 v;
uniform mat4 m;
uniform mat4 get;
uniform vec3 offset;
varying vec3 fragColor;
void main()
{
    fragColor = color;
    float z = (pos.z);
    float w = 1.0;
    gl_Position = p * v * m * vec4(
        pos.x + offset.x,
        pos.y + offset.y,
        z + offset.z,
        w
    );
    gl_PointSize = 3.50;
}`

const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
}`
const p = 0.25;
let dphi = 0;
let drho = 0;
const vertices = [];
// let i set the number of points
for (let i = 0; i < 250; i++){
    vertices.push(p * cos(dphi) * cos(drho)); // x - co-ordinate
    vertices.push(p * cos(dphi) * sin(drho)); // y - co-ordinate
    vertices.push(p * sin(dphi)); // z - co-ordinate
    // dphi += PI / 180;
    // drho += PI / 180;
    dphi += (PI * Math.random());
    drho += (PI * Math.random());
    const c = getColor();
    vertices.push(c[0]);
    vertices.push(c[1]);
    vertices.push(c[2]);
};
test("sphere: vertices ", vertices.length/6);



export { vsSource, fsSource, vertices, p };