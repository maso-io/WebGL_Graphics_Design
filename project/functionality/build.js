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

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return (null);
    }
    return (shader);
}

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

function mat4() {
    return ([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

function getColor() {
    const ranColor = [
        Math.random(),
        Math.random(),
        Math.random()
    ];
    return ranColor;
}

function gameOver() {
    const btn = document.querySelector(`.start-button`);
    document.getElementById(`intro`).pause();
    document.getElementById(`main`).pause();
    document.getElementById(`ending`).play();
    document.getElementById(`canva`).style = "display: none;"
    btn.style = "display: block;"
    btn.setAttribute(`data-state`, 2);
    btn.textContent = `Re-start`;
    document.getElementById(`game-over`).style = "display: inline-block;";
}

export { initShader, loadShader, initBuffer, multiply, mat4, getColor, gameOver };