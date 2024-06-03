//Define sources
const vsSource = `
precision mediump float;

attribute vec3 pos;
attribute vec3 color;

uniform vec3 scale;
uniform mat4 rot_x;
uniform mat4 rot_y;
uniform mat4 rot_z;

varying vec3 fragColor;
void main(){
    fragColor = color;
    gl_Position = rot_x * rot_y * rot_z * vec4(
        pos.x * scale.x,
        pos.y * scale.y,
        pos.z * scale.z,
    1.0);
    gl_PointSize = 15.0;
}`
const fsSource = `
precision mediump float;

varying vec3 fragColor;
void main(){
    gl_FragColor = vec4(fragColor, 1.0);
}`
const v = 0.25;
const vertices = [
    // x , y , z         R, G, B

    // XY PLANE: front square
    -v, v, v,   
    -v, -v, v,  
    v, -v, v,   
    v, v, v,    
    // XY PLANE: back square
    -v, v, -v,  
    -v, -v, -v, 
    v, -v, -v,  
    v, v, -v,   

//YZ PLANE: right square
    v, v, -v,   
    v, -v, -v,  
    v, -v, v,   
    v, v, v,    
//YZ PLANE: left square
    -v, v, -v,  
    -v, -v, -v, 
    -v, -v, v,  
    -v, v, v,   

// XZ PLANE: down
    -v, -v, v,  
    -v, -v, -v, 
    v, -v, -v,  
    v, -v, v,   
// XZ PLANE: up
    -v, v, v,   
    -v, v, -v,  
    v, v, -v,   
    v, v, v,    
];

const colors = [
    // R, B, G

    // XY PLANE: front square
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,

    // XY PLANE: back square
    0.0, 1.0, 0.8,
    0.0, 1.0, 0.8,
    0.0, 1.0, 0.8,
    0.0, 1.0, 0.8,

    // YZ PLANE: right square
    0.5, 1.0, 0.0,
    0.5, 1.0, 0.0,
    0.5, 1.0, 0.0,
    0.5, 1.0, 0.0,

    // YZ PLANE: left square
    0.85, 0.4, 0.2,
    0.85, 0.4, 0.2,
    0.85, 0.4, 0.2,
    0.85, 0.4, 0.2,

    // XZ PLANE: down
    0.6, 0.0, 1.0,
    0.6, 0.0, 1.0,
    0.6, 0.0, 1.0,
    0.6, 0.0, 1.0,

    // XZ PLANE: up
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
];
const idMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
];
export { vsSource, fsSource, vertices, colors, idMatrix };