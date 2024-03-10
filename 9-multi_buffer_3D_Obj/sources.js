const vsSource = `
precision mediump float;

attribute vec3 pos;
attribute vec3 color;

uniform mat4 rot_x;
uniform mat4 rot_y;
uniform mat4 rot_z;
uniform mat4 scale;
varying vec3 fragColor;
void main()
{
    fragColor = color;
    gl_Position = scale * rot_x * rot_y * rot_z * vec4(pos, 1.0);
    gl_PointSize = 3.0;
}`

const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
}`
const p = 0.35;
const vertices = [p, 0, 0];
const colors = [];

export { vsSource, fsSource, vertices, colors, p };