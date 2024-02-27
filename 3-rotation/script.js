function initShader(vsSource, fsSource) {
    const vShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        alert(`program-error ${gl.getProgramInfoLog(program)}`);
        return;
    }
    return program;
}
function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert(`compile-error ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return;
    }
    return shader;
}
function initBuffer(vertices)
{
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    return buffer;
}
let i = 0;
let theta = 0;
function draw()
{
    console.log(i++);
    gl.clearColor(1.0, 0.25, 0.10, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += Math.PI / 180;
    gl.uniform1f(p_info.angle, theta);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    //gl.drawArrays(gl.POINT, 0, 6);
    requestAnimationFrame(draw);
}
const vsSource = `
precision mediump float;

attribute vec2 pos;

uniform float angle;
void main()
{
    gl_Position = vec4(
        pos.x * cos(angle) - pos.y * sin(angle),
        pos.x * sin(angle) + pos.y * cos(angle),
        0.0,
        1.0
    );
    gl_PointSize = 25.0;
}
`
const fsSource = `
precision mediump float;

void main()
{
    gl_FragColor = vec4(0.0, 0.95, 0.65, 1.0);
}
`
// start main-program
const canvas = document.querySelector(`canvas`);
const gl = canvas.getContext(`webgl`);
if (!gl) {
    throw new Error(`WebGL not supported/available`);
}
gl.clearColor(1.0, 0.25, 0.10, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// get program
const pts = [
    0.0, 0.5,     
    -0.5, 0.0,    
    0.5, 0.0,     
]
const buffer = initBuffer(pts);
const program = initShader(vsSource, fsSource);

const p_info = {
    buffer,
    pos: gl.getAttribLocation(program, `pos`),
    angle: gl.getUniformLocation(program, `angle`)
};
console.log(p_info);
gl.enableVertexAttribArray(p_info.pos);
gl.vertexAttribPointer(p_info.pos, 2, gl.FLOAT, gl.FALSE, 0, 0);
gl.useProgram(program);
//gl.drawArrays(gl.TRIANGLES, 0, 3);
draw();
