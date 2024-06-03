async function getShaderSource(url){
    const res = await fetch(url);
    return (await res.text());
}
function initProgram(webgl, vsSource, fsSource){
    const vShader = loadShader(webgl, webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fsSource);

    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)){
        alert(`Program ${webgl.getProgramInfoLog(program)}`);
        webgl.deleteShader(vShader);
        webgl.deleteShader(fShader);
        webgl.deleteProgram(program);
        return (null);
    }
    return (program);
}
function loadShader(webgl, type, source){
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)){
        alert(`Shader ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return (null);
    }
    return (shader);
}
function initBuffer(webgl, data){
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(data), webgl.STATIC_DRAW);
    return (buffer);
}
//
import { rotY, isPower2, matrixMul} from "./funcDef.js";
import { vs,fs } from "./source.js";
// start main program 
isPower2(1024);
console.log(matrixMul(
    [
        1, 0, 0, 0,
        0, 2, 0, 0,
        0, 0, 3, 0,
        0, 0, 0, 4
    ],
    [
        1, 0, 0, 0,
        0, 2, 0, 0,
        0, 0, 3, 0,
        0, 0, 0, 4
    ]
))

const canvas = document.querySelector(`#canva`);
const webgl = canvas.getContext(`webgl`);

const v = 0.5;
const vsSource = vs;//getShaderSource("fSource.glsl");
const fsSource = fs;//getShaderSource("vSource.glsl");
console.log(vsSource);
if (!webgl){
    throw new Error(`WebGL not supported`);
}
const program = initProgram(webgl, vsSource, fsSource);
webgl.useProgram(program);
const vertices = [
    // front square
    // x, y, z, u, v
    v, v, v,    
    v, -v, v,   
    -v, -v, v,  
    -v, v, v,   

    // back square
    v, v, -v,   
    v, -v, -v,  
    -v, -v, -v, 
    -v, v, -v,  
]
const texCoordinates = [
    // front flag
    1, 1,
    1, 0,
    0, 0,
    0, 1,

    // back flag
    0, 1,
    0, 0,
    1, 0,
    1, 1,
];
const vBuffer = initBuffer(webgl, vertices);
const texCoordBuffer = initBuffer(webgl, texCoordinates);

//const image = document.getElementById(`texImage`);
const image = new Image();
image.src = "./assets/saflag.png";
//image.src = "./assets/saflag.png"

const texBuffer = webgl.createTexture();
webgl.bindTexture(webgl.TEXTURE_2D, texBuffer);

if (0 && isPower2(image.height) && isPower2(image.width)) {
    webgl.generateMipmap(webgl.TEXTURE_2D);
    console.log(`*******************mipmaps******************`);
} else {
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
}
webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, image);


const posLXN = webgl.getAttribLocation(program, `pos`);
const texLXN = webgl.getAttribLocation(program, `vtexture`);
const rotLXN = webgl.getUniformLocation(program, `rot_y`);
webgl.enable(webgl.DEPTH_TEST);

webgl.bindBuffer(webgl.ARRAY_BUFFER, vBuffer);
webgl.enableVertexAttribArray(posLXN);
webgl.vertexAttribPointer(
    posLXN,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    0,
    0
);
webgl.bindBuffer(webgl.ARRAY_BUFFER, texCoordBuffer);
webgl.enableVertexAttribArray(texLXN);
webgl.vertexAttribPointer(
    texLXN,
    2,
    webgl.FLOAT,
    webgl.FALSE,
    0,
    0
);
webgl.uniformMatrix4fv(rotLXN, webgl.FALSE, [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
])
const shift = webgl.getUniformLocation(program, `shift`);
let moveX = 0;
let moveY = 0;

document.addEventListener("keydown", (e) => { 
    const key = e.key;
    console.log(key);
    if (key == "ArrowUp") {
        moveY += 0.02;
        webgl.uniform2f(shift, moveX, moveY);
    };
    if (key == "ArrowDown") {
        moveY -= 0.02;
        webgl.uniform2f(shift, moveX, moveY);
    };
    if (key == "ArrowLeft") {
        moveX -= 0.02;
        webgl.uniform2f(shift, moveX, moveY);
    };
    if (key == "ArrowRight") {
        moveX += 0.02; 
        webgl.uniform2f(shift, moveX, moveY);
    }; 
});



let dA = 0;
function draw() {
    webgl.clearColor(0.98, 0.97, 0.905, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.bindTexture(webgl.TEXTURE_2D, texBuffer);
    webgl.activeTexture(webgl.TEXTURE0);

    webgl.uniformMatrix4fv(rotLXN, webgl.FALSE, rotY(dA));
    webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 4);
    webgl.drawArrays(webgl.TRIANGLE_FAN, 4, 4);
    dA += Math.PI/180;

    requestAnimationFrame(draw);
}
draw();

