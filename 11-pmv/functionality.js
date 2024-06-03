// GLOBAL CONSTANTS
const tan = Math.tan;

/**
 * initShader - init shader program
 * @param {WebGL2RenderingContext} webgl
 * @param {string} vsSource 
 * @param {string} fsSource 
 * @returns {WebGLProgram} program 
 */
function initShader(webgl, vsSource, fsSource) {
    const vShader = loadShader(webgl, webgl.VERTEX_SHADER, vsSource);
    const fShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fsSource);
    
    const program = webgl.createProgram();
    webgl.attachShader(program, vShader);
    webgl.attachShader(program, fShader);
    webgl.linkProgram(program);
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        alert(`Program ${webgl.getProgramInfoLog(program)}`);
        webgl.deleteShader(vShader);
        webgl.deleteShader(fShader);
        return (null);
    }
    return (program);
}
/**
 * loadShader - creates and returns shader
 * @param {WebGL2RenderingContext} webgl
 * @param {number} type 
 * @param {string} source 
 * @returns {WebGLShader} shaderProgram
 */
function loadShader(webgl, type, source) {
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        alert(`Shader ${webgl.getShaderInfoLog(shader)}`);
        webgl.deleteShader(shader);
        return (null);
    }
    return (shader);
}
/**
 * initBuffer - initializes a data buffer
 * @param {WebGL2RenderingContext} webgl
 * @param {Float32Array} data 
 * @returns {WebGLBuffer} buffer
 */
function initBuffer(webgl, data) {
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
        webgl.ARRAY_BUFFER,
        new Float32Array(data),
        webgl.STATIC_DRAW
    );
    return (buffer);
}
/**
 * getColor - generates random RGB colors
 * @returns RGB array
 */
function getColor() {
    const c = [
        Math.random(),
        Math.random(),
        Math.random()
    ]
    return (c);
}
/**
 * createmat4 - creates identity matrix
 * @returns {Float32Array}identityMatrix
 */
function createmat4() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ];
}
/**
 * multiply - multiplies two matrices together
 * @param {matrix} matA 
 * @param {matrix} matB 
 * @returns the product of 2 matrices
 */
function multiply(mat1, mat2) {
    const N = 4;
    const res = [];
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            res[i * N + j] = 0;
            for (let k = 0; k < N; k++)
                res[i * N + j] += mat1[i * N + k] * mat2[k * N + j];
        }
    }
    return res;
}
function perspective(out, fovy, aspect, near, far) {
     var f = 1.0 / Math.tan(fovy / 2),
         nf;
     out[0] = f / aspect;
     out[1] = 0;
     out[2] = 0;
     out[3] = 0;
     out[4] = 0;
     out[5] = f;
     out[6] = 0;
     out[7] = 0;
     out[8] = 0;
     out[9] = 0;
     out[11] = -1;
     out[12] = 0;
     out[13] = 0;
     out[15] = 0;

     if (far != null && far !== Infinity) {
       nf = 1 / (near - far);
       out[10] = (far + near) * nf;
       out[14] = 2 * far * near * nf;
     } else {
       out[10] = -1;
       out[14] = -2 * near;
     }

     return out;
}

function perspective2(fov, aspect, znear, zfar) {
    test("aspect: ", aspect);
    test("fov: ", fov);
     const f = 1.0 / tan(fov / 2);
     const zdiff = zfar - znear;
     const lambda = zfar / zdiff;
     const projection = [
         f * aspect, 0, 0, 0,
         0, f, 0, 0,
         0, 0, lambda, -lambda * (znear),
         0, 0, 1, 0
     ]
     return (projection);
 }

// function perspective(fovy, aspect, near, far) {
//     var f = 1.0 / Math.tan(fovy / 2), nf;
    
//     let projection = [
//         f / aspect, 0, 0, 0,
//         0, f, 0, 0,
//         0, 0, -1, 0,
//         0, 0, 0, 0
//     ]

//     if (far != null && far !== Infinity) {
//        nf = 1 / (near - far);
//        projection[10] = (far + near) * nf;
//        projection[14] = 2 * far * near * nf;
//     } else {
//        projection[10] = -1;
//        projection[14] = -2 * near;
//     }

//     return (projection);
// }


function test(keyword, data) {
    console.log(`--------- ${keyword} ----------`);
    console.log(data);
    console.log(`------------------ \n`);
}

export { test, initShader, initBuffer, loadShader, getColor, createmat4, multiply, perspective, perspective2 };