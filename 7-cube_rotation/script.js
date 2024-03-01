// pos.x * cos(angle)- pos.z * sin(angle),
// pos.y,
// pos.z * cos(angle) + pos.x * sin(angle),
// 1.0
//Define constants
const PI = Math.PI;
const cos = Math.cos;
const sin = Math.sin;
const rand = Math.random;

//Define source
const vsSource = `
precision mediump float;

attribute vec3 pos;
attribute vec3 color;

uniform mat4 rot_x;
uniform mat4 rot_y;
uniform mat4 rot_z;

varying vec3 fragColor;
void main(){
    fragColor = color;
    gl_Position = rot_x * rot_y * rot_z * vec4(pos, 1.0);
    gl_PointSize = 15.0;
}`
const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main(){
    gl_FragColor = vec4(fragColor, 1.0);
}`
// Define methods
function initShader(fsSource, vsSource){
    const vShader = loadShader(webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl.FRAGMENT_SHADER, fsSource);

    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);

    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)){
        alert(`program: ${webgl.getProgramInfoLog(program)}`);
        return;
    }
    return program;
}
function loadShader(type, source){
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);

    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)){
        alert(`shader: ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return;
    }
    return shader;
}
function initBuffer(){
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

    return;
}
// handle buttons
const buttons = document.querySelectorAll(`button`);
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        // get current state
        const state = parseInt(btn.getAttribute("data-state"));
        // update state
        const newState = (state === -1 ? 1 : -1);
        btn.setAttribute("data-state", newState);

        // update button
        btn.textContent = (newState === 1 ? `stop` : `start`);

        console.log(state)
    });
});
console.log(buttons);
const dA = PI / 180;
const dB = PI / 180;
const dC = PI / 180;
let A = 0;	// offset initial rotation angle about x-axis
let B = 0;	// offset initial rotation angle about y-axis
let C = 0;	// offset initial rotation angle about z-axis

function draw(){
    // clear canvas
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    // set rotation matrices
    let rot_x = new Float32Array([
		1, 0, 0, 0,
		0, cos(A), -sin(A), 0,
		0, sin(A), cos(A), 0,
		0, 0, 0, 1,
	]);
	let rot_y = new Float32Array([
		cos(B), 0, -sin(B), 0,
		0, 1, 0, 0,
		sin(B), 0, cos(B), 0,
		0, 0, 0, 1,
	]);
	let rot_z = new Float32Array([
		cos(C), -sin(C), 0, 0,
		sin(C), cos(C), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
    ]);
    // set the "1" matrix
	let idMatrix = new Float32Array([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	]);
    let state = [];
    const axis = [rot_x, rot_y, rot_z, idMatrix];
    buttons.forEach((btn) => {
        state.push(
            parseInt(btn.getAttribute("data-state"))
        );
    });
    let i = 0;
    buttons.forEach((btn) => {
        const state = parseInt(btn.getAttribute("data-state"));
        if (state == 1) {
            if (i == 0) {
                A += dA;
            } else if (i == 1) {
                B += dB;
            } else {
                C += dC;
            }
            webgl.uniformMatrix4fv(
                p_info.axis[i],
                webgl.FALSE,
                axis[i]
            );
        } else {
            webgl.uniformMatrix4fv(
                p_info.axis[i],
                webgl.FALSE,
                axis[3]
            );
        };
        i++;
    });
    
    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 4, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 8, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 12, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 16, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 20, 4);
    requestAnimationFrame(draw);
}
//
// Start main program
//
const canvas = document.getElementById(`canva`);
const webgl = canvas.getContext(`webgl`);
if (!webgl)
{
    throw new Error(`WebGL not supported`);
}
webgl.enable(webgl.DEPTH_TEST);
webgl.clearColor(0.20, 0.20, 0.20, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const program = initShader(fsSource, vsSource);
const vertices = [
    // x , y , z         R, G, B

    // XY PLANE: front square
    -0.25, 0.25, 0.25,   1.0, 1.0, 0.0,
    -0.25, -0.25, 0.25,  1.0, 1.0, 0.0,
    0.25, -0.25, 0.25,   1.0, 1.0, 0.0,
    0.25, 0.25, 0.25,    1.0, 1.0, 0.0,
    // XY PLANE: back square
    -0.25, 0.25, -0.25,  0.0, 1.0, 0.8,
    -0.25, -0.25, -0.25, 0.0, 1.0, 0.8,
    0.25, -0.25, -0.25,  0.0, 1.0, 0.8,
    0.25, 0.25, -0.25,   0.0, 1.0, 0.8,

    // YZ PLANE: right square
    0.25, 0.25, -0.25,  0.5, 1.0, 0.0,
    0.25, -0.25, -0.25, 0.5, 1.0, 0.0,
    0.25, -0.25, 0.25,  0.5, 1.0, 0.0,
    0.25, 0.25, 0.25,   0.5, 1.0, 0.0,
    // YZ PLANE: left square
    -0.25, 0.25, -0.25,  0.85, 0.4, 0.2,
    -0.25, -0.25, -0.25, 0.85, 0.4, 0.2,
    -0.25, -0.25, 0.25,  0.85, 0.4, 0.2,
    -0.25, 0.25, 0.25,   0.85, 0.4, 0.2,

    // XZ PLANE: down
    -0.25, -0.25, 0.25,  0.6, 0.0, 1.0,
    -0.25, -0.25, -0.25, 0.6, 0.0, 1.0,
    0.25, -0.25, -0.25,  0.6, 0.0, 1.0,
    0.25, -0.25, 0.25,   0.6, 0.0, 1.0,
    // XZ PLANE: up
    -0.25, 0.25, 0.25,   1.0, 0.0, 0.0,
    -0.25, 0.25, -0.25,  1.0, 0.0, 0.0,
    0.25, 0.25, -0.25,   1.0, 0.0, 0.0,
    0.25, 0.25, 0.25,    1.0, 0.0, 0.0,
];

const buffer = initBuffer();
webgl.useProgram(program);

// compile program info
const p_info = {
    pos: webgl.getAttribLocation(program, `pos`),
    color: webgl.getAttribLocation(program, `color`),
    axis: [
        webgl.getUniformLocation(program, `rot_x`),
        webgl.getUniformLocation(program, `rot_y`),
        webgl.getUniformLocation(program, `rot_z`),
    ],
}

webgl.enableVertexAttribArray(p_info.pos);
webgl.vertexAttribPointer(
    p_info.pos,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT
)

webgl.enableVertexAttribArray(p_info.color);
webgl.vertexAttribPointer(
    p_info.color,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    6 * 4,
    3 * 4,
);

draw()
