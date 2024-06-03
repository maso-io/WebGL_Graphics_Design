import { fsSource, vertices, vsSource } from "./sources.js";
import { idMatrix, scaleMatrix, rotX, rotY, rotZ } from "./rotation.js";
import { initShader, initBuffer, createmat4, multiply, test, perspective, perspective2 } from "./functionality.js";
// GLOBAL CONSTANTS
const F32_SIZE = Float32Array.BYTES_PER_ELEMENT;
const PI = Math.PI;
const canvas = document.getElementById(`canva`);
/**
 * @type {WebGL2RenderingContext}
 */
const webgl = canvas.getContext(`webgl2`);
if (!webgl) {
    throw new Error(`WebGL not available/supported`);
}
/**
 * @type {WebGLProgram}
 */
let program;
/**
 * @type {Sphere[]}
 */
const spheres = [];
/**
 * @type {NodeList}
 */
const buttons = document.querySelectorAll(`button`);
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const state = btn.getAttribute("data-state");
        const newState = (state == -1 ? 1 : -1);
        btn.setAttribute("data-state", newState);
        btn.textContent = (state == -1 ? "stop" : "start");
    })
});

const scaleSlider = document.querySelector(`#scale`);
scaleSlider.addEventListener("input", () => {
    const factor = scaleSlider.value;
    console.log(factor);
    for (const sphere of spheres) {
        sphere.model = multiply(sphere.model, scaleMatrix(factor));
    }
});

class Sphere {
    static ID = 0;
    static THETA = 0.4 * PI / 180;

    constructor(data) {

        this.id = Sphere.ID;
        this.position = [0, 0, 0];
        this.perspective = createmat4();
        this.view = createmat4();
        this.model = createmat4();
        this.vertices = data.length / 6;
        this.dX = 0;
        this.dY = 0;
        this.dZ = 0;

        const buffer = initBuffer(webgl, data);
        this.p_info = {
            pos: webgl.getAttribLocation(program, `pos`),
            color: webgl.getAttribLocation(program, `color`),
            matrix: {
                p: webgl.getUniformLocation(program, `p`),
                v: webgl.getUniformLocation(program, `v`),
                m: webgl.getUniformLocation(program, `m`),
            },
            offset: webgl.getUniformLocation(program, `offset`)
        }

        this.vao = webgl.createVertexArray();
        webgl.bindVertexArray(this.vao);
        webgl.enableVertexAttribArray(this.p_info.pos);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
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

        webgl.bindBuffer(webgl.ARRAY_BUFFER, null);
        webgl.bindVertexArray(null);
        Sphere.ID++;
    }

    draw() {
        webgl.bindVertexArray(this.vao);

        webgl.uniform3fv(this.p_info.offset, this.position);
            webgl.uniformMatrix4fv(
            this.p_info.matrix.p,
            webgl.FALSE,
            this.perspective
            );
            webgl.uniformMatrix4fv(
                this.p_info.matrix.v,
                webgl.FALSE,
                this.view
            );
            webgl.uniformMatrix4fv(
                this.p_info.matrix.m,
                webgl.FALSE,
                this.model
            );
        webgl.drawArrays(webgl.POINTS, 0, this.vertices);
    }
}

function main() {
    webgl.clearColor(0.989, 0.959, 0.979, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    webgl.enable(webgl.DEPTH_TEST);


    program = initShader(webgl, vsSource, fsSource);
    webgl.useProgram(program);

    spheres.push(new Sphere(vertices));
    spheres.push(new Sphere(vertices));
    spheres.push(new Sphere(vertices));
    spheres.push(new Sphere(vertices));

    for (const sphere of spheres) {
        if (sphere.id == 0) {
            sphere.position = [0.5, 0, -0.50];
        }
        if (sphere.id == 1) {
            sphere.position = [-0.5, 0, 0.5];
        }
        if (sphere.id == 2) {
            sphere.position = [0, 0.5, 0.5];
        }
        if (sphere.id == 3) {
            sphere.position = [0, -0.5, -0.5];
        }
    }
    draw();
}


function draw(timestamp = 0) {
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    for (const sphere of spheres) {
        //  const multiplier = 200 * (sphere.id + 1);
        //  sphere.position = [
        //      Math.cos(timestamp/multiplier)  * 0.5,
        //      Math.sin(timestamp/multiplier) * 0.5,
        //      0
        //  ];
        let i = 0;
        for (const button of buttons) {
            const state = button.getAttribute("data-state");
            if (state == 1) {
                if (i == 0) {
                    // DO X ROTATION
                    sphere.model = multiply(sphere.model, rotX(Sphere.THETA)); 
                    sphere.dX += Sphere.THETA;
                } else if (i == 1) {
                    // DO Y ROTATION
                    sphere.model = multiply(sphere.model, rotY(Sphere.THETA)); 
                    sphere.dY += Sphere.THETA;
                } else {
                    // DO Z ROTATION
                    sphere.model = multiply(sphere.model, rotZ(Sphere.THETA)); 
                    sphere.dZ += Sphere.THETA;
                }
            }
            i++;
        }
        //perspective(sphere.perspective, 75  * Math.PI/180,  canvas.width/canvas.height, 0.1,  10000 );    
        //sphere.perspective = perspective2(75 * Math.PI / 180, canvas.height / canvas.width, 0.1, 10000);
        test(`sphere ${sphere.id} p:`, sphere.perspective);
        sphere.draw();
    }
    requestAnimationFrame(draw);
}

main();