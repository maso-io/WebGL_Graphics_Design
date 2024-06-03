import { loadSource, test, initShader, initBuffer, loadShader, matrixMul } from "./func.js";
import { vsSourse, fsSource } from "./shaders/sources.js";
test("vsSourse", vsSourse);

// SET GLOBAL VALUES
const canvas = document.querySelector("#gl-canvas");
/**
 * @type {WebGL2RenderingContext}
 */ 
const webgl = canvas.getContext(`webgl2`);
if (!webgl) {
    throw new Error(`WebGl not available`);
}
const F32_SIZE = Float32Array.BYTES_PER_ELEMENT;
const R_FLOAT = Math.random;

// GET SOURCES
const sources = [];
loadSource("./shaders/vertex.glsl").then(function(result) {
    sources.push(result); // Push the PromiseResult to the array
});
loadSource("./shaders/fragment.glsl").then(function(result) {
    sources.push(result); // Push the PromiseResult to the array
});
test("sources", sources);




/**
 * @type {WebGLProgram}
 */
let program;
/**
 * @type {WebGLUniformLocation}
 */
let uOffset;
/**
 *  @type {Triangle[]}
 */
const triangles = [];


class Triangle {

    constructor(id, data) {
        this.id = id;
        this.position = [0, 0, 0];
        this.p_info = {
            pos: webgl.getAttribLocation(program, `pos`),
            color: webgl.getAttribLocation(program, `color`),
            uOffset: webgl.getUniformLocation(program, `shift`)
        };
        const buffer = initBuffer(webgl, data);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);

        // set-up vertex array object: to define attribute pointers for each object
        this.vao = webgl.createVertexArray();
        webgl.bindVertexArray(this.vao);
        webgl.enableVertexAttribArray(this.p_info.pos);
        webgl.vertexAttribPointer(
            this.p_info.pos,
            3,
            webgl.FLOAT,
            webgl.FALSE,
            6 * F32_SIZE,
            0
        );
        webgl.enableVertexAttribArray(this.p_info.color);
        webgl.vertexAttribPointer(
            this.p_info.color,
            3,
            webgl.FLOAT,
            webgl.FALSE,
            6 * F32_SIZE,
            3 * F32_SIZE
        );

        // unbind buffers
        webgl.bindBuffer(webgl.ARRAY_BUFFER, null);
        webgl.bindVertexArray(null);
    };

    draw() {
        webgl.bindVertexArray(this.vao);
        webgl.uniform3fv(this.p_info.uOffset, this.position);
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);
    }
}


function main() {
    webgl.clearColor(0.20, 0.20, 0.20, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    program = initShader(webgl, vsSourse, fsSource);
    webgl.useProgram(program);

    triangles.push(new Triangle(0, [
        -0.925, 0.075, 0, R_FLOAT(), R_FLOAT(), R_FLOAT(),
        -0.500, 0.925, 0, R_FLOAT(), R_FLOAT(), R_FLOAT(),
        -0.075, 0.075, 0, R_FLOAT(), R_FLOAT(), R_FLOAT()
    ]));
    triangles.push(new Triangle(1, [
        0.075, 0.075, 0, R_FLOAT(), R_FLOAT(), R_FLOAT(),
        0.500, 0.925, 0, R_FLOAT(), R_FLOAT(), R_FLOAT(),
        0.925, 0.075, 0, R_FLOAT(), R_FLOAT(), R_FLOAT()
    ]));
    test("triangles", triangles)
    draw();
}


function draw() { 
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    for (const triangle of triangles) {
        test(`triangleID ${triangle.id}`, triangle);
        triangle.position[0] -= 0.002 * (triangle.id + 1);
        if (triangle.position[0] < -1) {
            triangle.position[0] = 1;   
        }
        triangle.draw();
    }

    requestAnimationFrame(draw);
}

main();