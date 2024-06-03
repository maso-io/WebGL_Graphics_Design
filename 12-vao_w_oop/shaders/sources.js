const vsSourse = `
precision mediump float;

attribute vec3 pos;
attribute vec3 color;

uniform vec3 shift;
varying vec3 fColor;
void main(){
    fColor = color;
    gl_Position = vec4(
        pos.x + shift.x,
        pos.y + shift.y,
        pos.z + shift.z,
        1.0
    );
    gl_PointSize = 5.0;
}
`;

const fsSource = `
precision mediump float;

varying vec3 fColor;

void main() {
    gl_FragColor = vec4(fColor, 1.0);
}
`;

export { vsSourse, fsSource };