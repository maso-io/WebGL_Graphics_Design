function initShader(fsSource, vsSource)
{
    const vShader = loadShader(webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl.FRAGMENT_SHADER, fsSource);
    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);

    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS))
    {
        alert(`program ${webgl.getProgramInfoLog(program)}`);
        return;
    }
    return program;
}
function loadShader(type, source)
{
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);

    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS))
    {
        alert(`shader ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return;
    }
    return shader;
}
function initBuffer()
{
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
        webgl.ARRAY_BUFFER,
        new Float32Array(vertices),
        webgl.STATIC_DRAW
    );
    return buffer;
}
let pheta = Math.PI / 36;
let dpheta = 0.15;
let speedX = 0.01;
let speedY = 0.003;
let shift_A = [-0.20, 0.20];

let sX = 0.021;
let sY = -0.003;
let shift_B = [0.20, -0.20];
function draw()
{
    webgl.clearColor(0.1, 0.85, 0.9, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    
    if (start == 1) {
        // detect colision
        if (abs(shift_A[0] - shift_B[0]) <= 0.4 &&
            abs(shift_A[1] - shift_B[1] <= 0.2)){
            sX *= -1;
            speedX *= -1;
            sY *= -1;
            speedY *= -1;

            shift_B[0] += sX;
            shift_A[0] += speedX;
            shift_A[1] += speedY;
            shift_B[1] += sY;

        } else if (abs(shift_A[0] - shift_B[0]) <= 0.2 &&
            abs(shift_A[1] - shift_B[1] <= 0.4)) {
            sX *= -1;
            speedX *= -1;
            sY *= -1;
            speedY *= -1;

            shift_B[0] += sX;
            shift_A[0] += speedX;
            shift_A[1] += speedY;
            shift_B[1] += sY;
        }
        else {
            // calculate and set position for object 1
            if (shift_A[0] <= -1 + 0.2 || shift_A[0] >= 1 - 0.2) {
                speedX *= -1;
                dpheta *= -1;
            }
            if (shift_A[1] <= -1 + 0.2 || shift_A[1] >= 1 - 0.2) {
                speedY *= -1;
            }
            pheta += dpheta;
            shift_A[0] += speedX;
            shift_A[1] += speedY;

            // calculate and set position for object 2
            if (shift_B[0] <= -1 + 0.2 || shift_B[0] >= 1 - 0.2) {
                sX *= -1;
            }
            if (shift_B[1] <= -1 + 0.2 || shift_B[1] >= 1 - 0.2) {
                sY *= -1;
            }
            shift_B[0] += sX;
            shift_B[1] += sY;        
        }
    }


    // update positions for objects and draw
    webgl.uniform2f(p_info.shift, shift_A[0], shift_A[1]);
    webgl.drawArrays(webgl.LINE_LOOP, 0, num_v);
    webgl.uniform2f(p_info.shift, shift_B[0], shift_B[1]);
    webgl.drawArrays(webgl.TRIANGLE_FAN, num_v, num_v);
    webgl.uniform1f(p_info.angle, pheta); 
    requestAnimationFrame(draw);
}
// set up btn
const btn = document.querySelector(`#btn`);
btn.addEventListener("click", function state()
{
    if (start == -1) {
        start *= -1;
        return;
    } else {
        start = -1;
    }
});
// define sources and constants
let start = 1;
const PI = Math.PI;
const vsSource = `
precision mediump float;

attribute vec2 pos;

uniform vec2 shift;
uniform float angle;
void main()
{
    gl_Position = vec4(
        (pos.x * cos(angle) - pos.y * sin(angle)) + shift.x,
        (pos.y * cos(angle) + pos.x * sin(angle)) + shift.y,
        0.0,
        1.0
    );
    gl_PointSize = 5.0;
}`
const fsSource = `
precision mediump float;

void main()
{
    gl_FragColor = vec4(0.65, 0.35, 0.10, 1.0); 
}`
const abs = Math.abs;
// start main program
const canvas = document.getElementById(`webgl`);
const webgl = canvas.getContext(`webgl`);
if (!webgl)
{
    throw new Error(`WebGL not available/supported`);
}
// get program
const program = initShader(fsSource, vsSource);
// init points
let vertices = [0, 0];
let theta = PI / 36;
let i = 0;
for (i = 0; i <= 2 * PI; i += theta)
{
    vertices.push(0.2 * Math.cos(i));
    vertices.push(0.2 * Math.sin(i));
}
[0, 0].forEach(function (item) {
    vertices.push(item);
})
i = 0;
for (i = 0; i <= 2 * PI; i += theta)
{
    vertices.push(0.2 * Math.cos(i));
    vertices.push(0.2 * Math.sin(i));
}
console.log(vertices);
// bind data
const buffer = initBuffer();

// use program
webgl.useProgram(program);

// gather program info
const p_info = {
    buffer,
    pos: webgl.getAttribLocation(program, `pos`),
    shift: webgl.getUniformLocation(program, `shift`),
    angle: webgl.getUniformLocation(program, `angle`),
}

// enable vertex attribute array
webgl.enableVertexAttribArray(p_info.pos);

// set attribute layout
webgl.vertexAttribPointer(
    p_info.pos,
    2,
    webgl.FLOAT,
    webgl.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT,
    0
);
const num_v = vertices.length / 4;  // total number of vertices per object [for 2 objects]


// start animation rotation
webgl.uniform2f(p_info.shift, shift_A[0], shift_A[1]);
webgl.drawArrays(webgl.LINE_LOOP, 0, num_v);
webgl.uniform2f(p_info.shift, shift_B[0], shift_B[1]);
webgl.drawArrays(webgl.TRIANGLE_FAN, num_v, num_v);
draw();
