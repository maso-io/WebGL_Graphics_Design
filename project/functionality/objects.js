import { mat4, initBuffer } from "./build.js";
import { gl, program, canvas } from "../main.js"

// GLOBAL CONSTANTS
const PI = Math.PI;
const F32_SIZE = Float32Array.BYTES_PER_ELEMENT;


class Box {
    static ID = 0;
    static gameStatus = 1;
    static velX = 0.05;
    static velY = 0.05;
    static texCoordinates = [
        1, 1,
        1, 0,
        0, 0,
        0, 1,
    ]
    static src = "./assets/art/Silvara_norings.png" ;

    constructor(data, radius, color, src = Box.src) {
        console.log(`radius: ${radius} src: ${src}`);
        this.radius = radius;
        this.id = Box.ID;
        this.position = [1, 0];
        this.view = mat4();
        this.model = mat4();
        this.perspective = mat4();
        this.vertices = 4;
        this.z = 0;
        this.dX = 0;
        this.dY = 0;
        this.dZ = 0;

        const buffer = initBuffer(gl, data);
        const colorBuffer = initBuffer(gl, [
            color, color, color, color
        ].flat());
        const texCoordBuffer = initBuffer(gl, Box.texCoordinates);

        this.p_info = {
            pos: gl.getAttribLocation(program, `pos`),
            color: gl.getAttribLocation(program, `color`),
            matrix: {
                p: gl.getUniformLocation(program, `p`),
                v: gl.getUniformLocation(program, `v`),
                m: gl.getUniformLocation(program, `m`),
            },
            offset: gl.getUniformLocation(program, `offset`),
            tex: gl.getAttribLocation(program, `vtexture`)
        }


        const image = new Image();
        image.src = src;
        this.texBuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texBuffer);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // set position
        gl.enableVertexAttribArray(this.p_info.pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            this.p_info.pos,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * F32_SIZE,
            0
        );
        // set color
        gl.enableVertexAttribArray(this.p_info.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(
            this.p_info.color,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * F32_SIZE,
            0
        );
        // set texture
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.enableVertexAttribArray(this.p_info.tex);
        gl.vertexAttribPointer(
            this.p_info.tex,
            2,
            gl.FLOAT,
            gl.FALSE,
            0,
            0
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindVertexArray(null);
        Box.ID++;
    }

    draw() {
        gl.bindVertexArray(this.vao);
        gl.bindTexture(gl.TEXTURE_2D, this.texBuffer);
        gl.activeTexture(gl.TEXTURE0);

        gl.bindVertexArray(this.vao);
        gl.uniform2fv(this.p_info.offset, this.position);
        gl.uniformMatrix4fv(
            this.p_info.matrix.p,
            gl.FALSE,
            this.perspective
            );
        gl.uniformMatrix4fv(
                this.p_info.matrix.v,
                gl.FALSE,
                this.view
            );
        gl.uniformMatrix4fv(
                this.p_info.matrix.m,
                gl.FALSE,
                this.model
            );
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices);
    }

    update(timestamp) {
        const multiplier = 200 * (this.id + 1);
        if ((this.position[0] - 0.05) > -1 && (this.position[0]) <= 1) {
            this.position[0] -= 0.01;
        } else {
            this.position[0] = 0.99;
        }
        this.position[1] = Math.sin(timestamp / multiplier) * (this.id % 3);
    }
}

class Plane extends Box {
    static velX = 0.05;
    static velY = 0.05;
    static src = "./assets/art/plane.png";

    constructor(data, radius, color, src = Plane.src) {
        super(data, radius, color, src);
    }
    draw() {
        gl.bindTexture(gl.TEXTURE_2D, this.texBuffer);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindVertexArray(this.vao);
        gl.uniform2fv(this.p_info.offset, this.position);
        gl.uniformMatrix4fv(
            this.p_info.matrix.p,
            gl.FALSE,
            this.perspective
            );
        gl.uniformMatrix4fv(
                this.p_info.matrix.v,
                gl.FALSE,
                this.view
            );
        gl.uniformMatrix4fv(
                this.p_info.matrix.m,
                gl.FALSE,
                this.model
            );
        //gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices);
    }
    update() {
        if (Box.ID % 3 == 0 && Box.ID != 0) {
            Plane.velX += 0.00005;
            Plane.velY += 0.00005;
        }
        //super.update();
    }
    collisionDetect(enemies) {
        for (const enemy of enemies) {
            const dx = this.position[0] - enemy.position[0];
            const dy = this.position[1] - enemy.position[1];
            const distance = Math.sqrt((dx * dx) + (dy * dy));

            if ((this.radius + enemy.radius) >= distance) {
                Box.gameStatus = 0;
            }
        }
    }
}

export { Box, Plane };