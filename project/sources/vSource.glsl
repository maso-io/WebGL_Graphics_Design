precision mediump float;

attribute vec2 vtexture;
attribute vec3 pos;
uniform mat4 rot_y;
varying vec2 fragtexture;
void main(){
    gl_Position = rot_y * vec4(pos, 1.0);
    gl_PointSize = 10.0;
    fragtexture = vtexture;
}