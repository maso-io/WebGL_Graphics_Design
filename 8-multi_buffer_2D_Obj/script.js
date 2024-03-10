function initShader(vsSource, fsSource)
{
	// INIT SHADER PROGRAM
	const vShader = loadShader(webgl.VERTEX_SHADER, vsSource);
	const fShader = loadShader(webgl.FRAGMENT_SHADER, fsSource);

	const program = webgl.createProgram();
	webgl.attachShader(program, vShader);
	webgl.attachShader(program, fShader);
	webgl.linkProgram(program);
	
	if (!webgl.getProgramParameter(program, webgl.LINK_STATUS))
	{
		alert(`Program: ${webgl.getProgramInfoLog(program)}`);
		return;
	};
	return (program);
}
function loadShader (type, source)
{
	// CREATE AND RETURN `TYPE` SHADER COMPONENT WITH `SOURCE`
	const shader = webgl.createShader(type);
	webgl.shaderSource(shader, source);
	webgl.compileShader(shader);
	if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS))
	{
		alert(`Shader: ${webgl.getShaderInfoLog(shader)}`);
		webgl.deleteShader(shader);
		return;
	}
	return (shader);
}
function initBuffer(data)
{
	// INITIAL RETURN WEBGL BUFFER WITH `DATA`
	const buffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(data), webgl.STATIC_DRAW); 
	
	return (buffer);
}
//IMPORT SOURCES
import {vsSource, fsSource, vertices, colors} from "./source.js";
// SET GLOBAL DEFINITION
const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;

const canvas = document.querySelector(`#canva`);
const webgl = canvas.getContext(`webgl`);
if (!webgl)
{
	throw new Error(`WebGL not supported`);
}
const program = initShader(vsSource, fsSource);
// SET INIT. POINT
let r = 0.25;
vertices.push(r);
vertices.push(0);

let i = 0;
const dtheta = PI / 4;
let theta = dtheta;
for (i = 0; i  < 2 * (1 / dtheta) * PI + 1; i++)
{
	vertices.push(r * cos(theta));
	vertices.push(r * sin(theta));
	theta += dtheta;
}

for (i = 0; i < Math.floor(vertices.length / 2); i++)
{
	let genColor = [Math.random(), Math.random(), Math.random()];
	colors.push(genColor[0]);
	colors.push(genColor[1]);
	colors.push(genColor[2]);
}
console.log(vertices);
console.log(colors);

const verticesBuffer = initBuffer(vertices);
const colorsBuffer = initBuffer(colors);
webgl.useProgram(program);

const p_info = {
	pos: webgl.getAttribLocation(program, `pos`),
	color: webgl.getAttribLocation(program, `color`)
};

webgl.useProgram(program);
webgl.enableVertexAttribArray(p_info.pos);
webgl.bindBuffer(webgl.ARRAY_BUFFER, verticesBuffer);
webgl.vertexAttribPointer(
	p_info.pos,
	2,
	webgl.FLOAT,
	webgl.FALSE,
	2 * 4,
	0 * 4
);
webgl.enableVertexAttribArray(p_info.color);
webgl.bindBuffer(webgl.ARRAY_BUFFER, colorsBuffer);

webgl.vertexAttribPointer(
	p_info.color,
	3,
	webgl.FLOAT,
	webgl.FALSE,
	3 * 4,
	0 * 4
);
console.log(`v_len ${vertices.length / 2}`);
console.log(`c_len ${colors.length / 3}`);


webgl.bindBuffer(webgl.ARRAY_BUFFER, null);
i = vertices.length / 2;
let j = 0;
// DRAWS' POINTS
// for (j = 0; j < i; j++){
// 	webgl.drawArrays(webgl.POINTS, j, 1);
// }
// DRAWS' TRIANGLES
// for (j = 0; j < (i / 3); j++) {
// 	webgl.drawArrays(webgl.TRIANGLES, j * 3, 3);
// }
// DRAW 
webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, i);

