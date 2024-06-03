import { colors, fsSource, vertices, vsSource } from "./sources.js";
import { idMatrix, scaleMatrix, rotX, rotY, rotZ } from "./rotation.js";
// defines function
/**
 * initProgram - init shader program
 * param {string} vsSource 
 * param {string} fsSource 
 * returns program 
 */
function initProgram(vsSource, fsSource) {
    const vShader = loadShader(webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl.FRAGMENT_SHADER, fsSource);
    
    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        alert(`Program ${webgl.getProgramInfoLog(program)}`);
        webgl.deleteShader(vShader);
        webgl.deleteShader(fShader);
        return (null);
    }
    return (program);
}

/**
 * loadShader - creates and returns shader
 * param {number} type 
 * param {string} source 
 * returns shader program
 */
function loadShader(type, source) {
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        alert(`Shader ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return (null);
    }
    return (shader);
}

/**
 * initBuffer - initializes a data buffer
 * param {number} data 
 * returns buffer
 */
function initBuffer(data) {
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
        webgl.ARRAY_BUFFER,
        new Float32Array(data),
        webgl.STATIC_DRAW
    );
    return (buffer);
}
/**
 * getColor - generates random RGB colors
 * returns RGB array
 */
function getColor() {
    const c = [
        Math.random(),
        Math.random(),
        Math.random()
    ]
    return (c);
}
// start main program
const canvas = document.getElementById(`canva`);
const webgl = canvas.getContext(`webgl`);

if (!webgl) {
    alert(`WebGL not available/supported`);
}
webgl.clearColor(0.989, 0.959, 0.979, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);

const program = initProgram(vsSource, fsSource);
webgl.useProgram(program);

const PI = Math.PI;
let dA = PI/ 36;
const cos = Math.cos;
const sin = Math.sin;
const rho = 0.4;

for (let theta = 0; theta <= PI; theta += PI / 36){
    for (let phi = 0; phi <= 2 * PI; phi += PI / 180){
        // set x
        const x = rho * sin(phi) * cos(theta);
        vertices.push(x);
        // set y
        const y = rho * sin(phi) * sin(theta);
        vertices.push(y);
        // set z
        const z = rho * cos(phi);
        vertices.push(z);
    }
}
for (let i = 0; i < vertices.length / 3; i++){
    const c = getColor();
    colors.push(c[0]);
    colors.push(c[1]);
    colors.push(c[2]);
};
console.log(vertices.length/3);
const cBuffer = initBuffer(colors);
const vBuffer = initBuffer(vertices);

const p_info = {
    pos: webgl.getAttribLocation(program, `pos`),
    color: webgl.getAttribLocation(program, `color`),
    axis: [
        webgl.getUniformLocation(program, `rot_x`),
        webgl.getUniformLocation(program, `rot_y`),
        webgl.getUniformLocation(program, `rot_z`),
    ],
    scale: webgl.getUniformLocation(program, `scale`)
};

webgl.enableVertexAttribArray(p_info.pos);
webgl.bindBuffer(webgl.ARRAY_BUFFER, vBuffer);
webgl.vertexAttribPointer(
    p_info.pos,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    3 * 4,
    0
);
webgl.enableVertexAttribArray(p_info.color);
webgl.bindBuffer(webgl.ARRAY_BUFFER, cBuffer);
webgl.vertexAttribPointer(
    p_info.color,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    3 * 4,
    0
);
webgl.bindBuffer(webgl.ARRAY_BUFFER, null);
const points = vertices.length / 3;
webgl.uniformMatrix4fv(
    p_info.scale,
    webgl.FALSE,
    idMatrix
);
webgl.uniformMatrix4fv(
    p_info.axis[0],
    webgl.FALSE,
    idMatrix
);
webgl.uniformMatrix4fv(
    p_info.axis[1],
    webgl.FALSE,
    idMatrix
);
webgl.uniformMatrix4fv(
    p_info.axis[2],
    webgl.FALSE,
    idMatrix
);
let B = 0;
const dB = PI / 180;

function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);
  
    if (1) {
        webgl.uniformMatrix4fv(
            p_info.axis[2],
            webgl.FALSE,
            rotY(B),
        );
    } else {
        webgl.uniformMatrix4fv(
            p_info.axis[2],
            webgl.FALSE,
            idMatrix
        );
    };
    B += dB;
    dA = PI / 36;
    webgl.drawArrays(webgl.POINTS, 0, points);
    requestAnimationFrame(draw);
}
draw();
