// Set Global PI
const PI = Math.PI;
function initShaderProgram(vsSource, fsSource)
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
function initBuffer(pts)
{
	const buffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(pts), webgl.STATIC_DRAW);
	return buffer;
}
// handle button
let motion = 1;
const btnMotion = document.querySelector("#btn-motion");
btnMotion.addEventListener("click", updateState);
function updateState() {
	if (motion == 1)
	{
		btnMotion.textContent = `start`;
		motion *= -1;
	} else {
		btnMotion.textContent = `stop`;
		motion *= -1;
	}
}
let rotation = 1;
const btnRotation = document.querySelector("#btn-rotation");
btnRotation.addEventListener("click", updateRotation);
function updateRotation() {
	if (rotation == 1)
	{
		btnRotation.textContent = `start`;
		rotation *= -1;
	} else {
		btnRotation.textContent = `stop`;
		rotation *= -1;
	}
}
// define draw
let theta = 0;
const dtheta = PI / 36;
let shift = [0, 0];
let dShift = [0.015, 0.022];
function draw()
{
	webgl.clearColor(0.11, 0.11, 0.11, 1.0);
	webgl.clear(webgl.COLOR_BUFFER_BIT);
	theta += dtheta;
	if (motion == 1)
	{
	shift[0] += dShift[0];
	shift[1] += dShift[1];
	if (shift[0] >= 1 - 0.25 || shift[0] <= -1 + 0.25)
	{
		dShift[0] *= -1;
	}
	if (shift[1] >= 1 - (1/3) || shift[1] <= -1 + (1/6))
	{
		dShift[1] *= -1;
	}
	}
	if (rotation == 1)
	{
		webgl.uniform1f(p_info.angle, theta);
	}
	webgl.uniform2f(p_info.shift, shift[0], shift[1]);
	webgl.drawArrays(webgl.TRIANGLES, 0, 3);

	requestAnimationFrame(draw);
}

// Define sources
const vsSource = `
precision mediump float;
attribute vec3 pos;
attribute vec3 color;

uniform float angle;
uniform vec2 shift;
varying vec3 fragColor;
void main()
{
	fragColor = color;
	gl_Position = vec4(
	(pos.x * cos(angle) - pos.z * sin(angle)) + shift.x,
	pos.y + shift.y,
	pos.z * cos(angle) + pos.x * sin(angle),
	1.0
	);
	gl_PointSize = 15.0;
}`
const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main()
{
	gl_FragColor = vec4(fragColor, 1.0);
}`

// start main program
const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl){
	alert(`WebGL not supported`);
}
const program = initShaderProgram(vsSource, fsSource);
let vertices = [
	0.0, 0.25,	1.0, 0.5, 0.8,
	-0.25, -0.25,	0.0, 0.5, 0.2,
	0.25, -0.25,	1.0, 0.75, 0.1,
];
const buffer = initBuffer(vertices);
webgl.useProgram(program);
const p_info = {
	buffer,
	pos: webgl.getAttribLocation(program, `pos`),
	color: webgl.getAttribLocation(program, `color`),
	angle: webgl.getUniformLocation(program, `angle`),
	shift: webgl.getUniformLocation(program, `shift`),
}
// enable vertex
webgl.enableVertexAttribArray(p_info.pos);
webgl.vertexAttribPointer(
	p_info.pos,
	2,
	webgl.FLOAT,
	webgl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT,
	0
)
webgl.enableVertexAttribArray(p_info.color);
webgl.vertexAttribPointer(
	p_info.color,
	3,
	webgl.FLOAT,
	webgl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT,
	2 * Float32Array.BYTES_PER_ELEMENT
)

// call draw
draw();


















