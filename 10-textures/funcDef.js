async function shaderSource(url){
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
    if (!webgl.getProgramParameter(programm, webgl.LINK_STATUS)){
        webgl.deleteShader(vShader);
        webgl.deleteShader(fShader);
        alert(`Program ${webgl.getProgramInfoLog(program)}`);
        return (null);
    }
    return (program);
}
function loadShader(webgl, type, source){
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)){
        webgl.deleteShader(shader);
        alert(`Shader ${webgl.getShaderInfoLog(shader)}`);
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
function rotY(a){
    const c = Math.cos;
    const s = Math.sin;
    const rot = [
        c(a), 0, -s(a), 0,
        0, 1, 0, 0,
        s(a), 0, c(a), 0,
        0, 0, 0, 1
    ]
    return rot;
}
function isPower2(val){
    let i = 0;
    const res = val.toString(2).split("");
    res.forEach(element => {
        if (element == '1'){
            i++;
        }
    });
    return (i == 1); 
}


function matrixMul(mat1, mat2) {
    const N = 4;
    const res = [];
    for (let i = 0; i < N; i++){
        for (let j = 0; j < N; j++){
            res[i * N + j] = 0;
            for (let k = 0; k < N; k++){
                res[i * N + j] += mat1[i * N + k] * mat2[k * N + j];
            }
        }
    }
    return (res);
}
export {shaderSource, initProgram, loadShader, initBuffer, rotY, isPower2, matrixMul};