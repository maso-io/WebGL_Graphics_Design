const vsSource = `
attribute vec2 pos;
attribute vec3 color;

varying vec3 fragColor;
void main()
{
	fragColor = color;
	gl_Position = vec4(pos, 0.0, 1.0);
	gl_PointSize = 10.0;
}`;
const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main()
{
	gl_FragColor = vec4(fragColor, 1.0);
}`;
const vertices = [];
const colors = [];

export {vsSource, fsSource, vertices, colors};