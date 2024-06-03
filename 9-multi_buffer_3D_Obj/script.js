import { vsSource, fsSource, vertices, colors, p } from "./sources.js";
import { idMatrix, scaleMatrix, rotX, rotY, rotZ } from "./rotation.js";

const src = [`./vSource.glsl`, `./fSource.glsl`];
const shaderSources = [];
async function load(src) {
    const res = await fetch(src);
    const resTXT = await res.text();
    return (resTXT);
}

function getSource() {
    src.forEach((element) => {
        load(element).then((output) => { 
            shaderSources.push(output);
        });
    });
}
getSource();
console.log(shaderSources);


// Set constants
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;

function initShader(vsSource, fsSource) {
    /**
     * initShader - Initiates and returns shader program
     * vsSource: Vertex Shader source
     * fsSource: Fragment Shader source
     * 
     * Return: Shader program or `null` on program error
     */
    const vShader = loadShader(webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl.FRAGMENT_SHADER, fsSource);
    // initiate program
    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);

    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        alert(`Program error ${webgl.getProgramInfoLog(program)}`);
        return (null);
    }
    return (program);
}
function loadShader(type, source) {
    /**
     * loadShader - create and return shader of specified `type` with `source`
     * type: specifies the type of shader to create
     * source: provides shader source
     * 
     * Return: returns the shader or `null` on error
     */
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        alert(`Shader error ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return (null);
    }
    return (shader);
}
function initBuffer(data) {
    /**
     * initBuffer - initiates a webgl buffer with the specified data
     * data: data to bind to the buffer
     * 
     * Return: webgl buffer or `null`
     */
    const buffer = webgl.createBuffer();
    if (!buffer | !data) {
        return (null);
    }
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
        webgl.ARRAY_BUFFER,
        new Float32Array(data),
        webgl.STATIC_DRAW
    );
    return (buffer);
}
function ranColor() {
    /**
     * ranColor - generates a random color
     * 
     * Return: array of a random color
     */
    return [Math.random(), Math.random(), Math.random()];
};
const buttons = document.querySelectorAll(`.btn`);
const scaleSlider = document.querySelector(`#scale`);

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        // change state and text-content
        const state = btn.getAttribute(`data-state`);
        const newState = (state == -1 ? 1 : -1);
        btn.textContent = (state == -1 ? `stop` : `start`);
        btn.setAttribute(`data-state`, newState);

    });
});
let phi = 0;
const dphi = PI / 150;
function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    let rot_x, rot_y, rot_z;
    const points = vertices.length / 3;

    rot_x = rotX(phi);
    rot_y = rotY(phi);
    rot_z = rotZ(phi);
    phi += dphi;
    const rot = [rot_x, rot_y, rot_z];
    let j = 0;
    buttons.forEach((btn) => {
        const state = btn.getAttribute(`data-state`);
        console.log(state)
        if (state == 1) {
            webgl.uniformMatrix4fv(
                p_info.axis[j],
                webgl.FALSE,
                rot[j]
            );
        } else {
            webgl.uniformMatrix4fv(
                p_info.axis[j],
                webgl.FALSE,
                idMatrix
            );
        }
        j++;
    });
    scaleSlider.addEventListener("input", () => {
        const factor = scaleSlider.value;
        console.log(factor);
        webgl.uniformMatrix4fv(
            p_info.scale,
            webgl.FALSE,
            scaleMatrix(factor),
        );
    });


    webgl.drawArrays(webgl.POINTS, 0, points);
    requestAnimationFrame(draw);
}
// main programs
const canvas = document.querySelector(`#canva`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) {
    alert(`WebGL not supported/available`);
}
webgl.clearColor(0.989, 0.959, 0.979, 1.0);
webgl.enable(webgl.DEPTH_TEST);
const program = initShader(vsSource, fsSource);
webgl.useProgram(program);

// generate points
let i = 0;
let dA = 0;
let dB = 0;
for (i = 0; i < 1000; i++) {
    // set x, y, z
    vertices.push(p * cos(dB) * cos(dA));
    vertices.push(p * cos(dB) * sin(dA));
    vertices.push(p * sin(dB));
    dA += (PI * Math.random());
    dB += (PI * Math.random());
    // dA += PI / 180;
    // dB += PI / 180;
};
i = vertices.length;
for (let j = 0; j < i; j++) {
    let c = ranColor();
    colors.push(c[0]);
    colors.push(c[1]);
    colors.push(c[2]);
};

const vBuffer = initBuffer(vertices);
const cBuffer = initBuffer(colors);

console.log(vertices);
console.log(vBuffer);
const p_info = {
    pos: webgl.getAttribLocation(program, `pos`),
    color: webgl.getAttribLocation(program, `color`),
    axis: [
        webgl.getUniformLocation(program, `rot_x`),
        webgl.getUniformLocation(program, `rot_y`),
        webgl.getUniformLocation(program, `rot_z`)
    ],
    scale: webgl.getUniformLocation(program, `scale`),
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
webgl.uniformMatrix4fv(
    p_info.scale,
    webgl.FALSE,
    idMatrix
);
// start drawing
draw();