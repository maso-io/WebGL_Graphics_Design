const vs = `precision mediump float;

attribute vec2 vtexture;
attribute vec3 pos;
uniform mat4 rot_y;
varying vec2 fragtexture;
uniform vec2 shift;
void main(){
    gl_Position = rot_y * vec4(pos.x + shift.x,pos.y + shift.y,pos.z, 1.0);
    gl_PointSize = 10.0;
    fragtexture = vtexture;
}`
const fs = `precision mediump float;

varying vec2 fragtexture;
uniform sampler2D fragSampler;
void main(){
    gl_FragColor = texture2D(fragSampler, fragtexture);
}`
export {vs, fs};