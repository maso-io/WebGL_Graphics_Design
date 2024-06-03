//DEFINE GOBLAL CONSTANTS



function matrixMul(matA, matB) {
    const N = 4;
    const res = [];

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            res[i * N + j] = 0;
            for (let k = 0; k < N; k++) {
                res[i * N + j] += matA[i * N + k] * matB[i * k + j];
            }
        }
    }
    return (res);
}
/**
 * initProgram - init shader program
 * param {WebGLContext} gl
 * param {string} vsSource 
 * param {string} fsSource 
 * returns program 
 */
function initShader(gl, vsSourse, fsSource) {
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vsSourse);
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    const program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert(`program ${gl.getProgramInfoLog(program)}`);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteProgram(program);
        return (null);
    }
    return (program);
}
/**
 * loadShader - creates and returns shader
 * param {WebGLContext} gl
 * param {number} type 
 * param {string} source 
 * returns shader program
 */
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return (null);
    }
    return (shader);
}
/**
 * initBuffer - initializes a data buffer
 * @param {WebGLContext} gl
 * @param {number} data 
 * returns buffer
 */
function initBuffer(gl, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(data),
        gl.STATIC_DRAW
    );
    return (buffer);
}
/**
 * loadSource - retrieves data stored in URL
 * @param {string} url 
 * @returns PromiseBasedTextObject
 */
async function loadSource(URL) {
    let result = await fetch(URL);
    result = await result.text();

    return (result);
}
function test(keyword, data) {
    console.log(`--------- ${keyword} ----------`);
    console.log(data);
    console.log(`------------------ \n`);
}

export { loadSource, test, initShader, initBuffer, loadShader, matrixMul };