// Define vetex shader source
// input parameters into vertex shader are `attributes`
// output parameters to vertex shader are the `varying`
const vsSource = `
precision mediump float;

attribute vec2 pos;
attribute vec3 vertColor;
uniform float x;
uniform float y;

varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = vec4(pos, 0.0, 1.0) + vec4(x, y, 0.0, 1.0);
}`
// Define fragment shader source
// the `varying` became the inputs in the fragment shader
// and the only output is the gl_FragColor global variable
const fsSource = `
precision mediump float;

varying vec3 fragColor;

void main()
{
    gl_FragColor = vec4(fragColor, 1.0); 
}`
// Define animation sources
let x = 0;
let y = 0;
let speedX = 0.01;
let speedY = 0.011;
let start = 1;

function draw() {
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    if (start == 1) {
        x += speedX;
        y += speedY;
        for (let i = 0; i < 2; i++)
        {
            let tmp_x = programInfo.buffer[i * 5];
            let tmp_y = programInfo.buffer[(i * 5) + 1];
            console.log(`tmp_x = ${tmp_x}`);
            console.log(`tmp_x + x = ${tmp_x + x}`);
            console.log(`tmp_x - x = ${tmp_x - x}`);
            console.log(`tmp_y = ${tmp_y}`);
            console.log(`tmp_y + y = ${tmp_y + y}`);
            console.log(`tmp_y - y = ${tmp_y - y}`);

            if (tmp_x + x >= 2 - 0.25 || tmp_x + x <= -2)
            {
                speedX = speedX * -1;
                x += speedX;
            }
            if (tmp_y + y >= 2 || tmp_y + y <= -2)
            {
                speedY = speedY * -1;
                y += speedY;
            }
        }
    }

    webgl.uniform1f(programInfo.uniformLocation.x, x);
    webgl.uniform1f(programInfo.uniformLocation.y, y);
    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
    //add code for changing second triangle here
    // define different variable for x2 , y2
    webgl.uniform1f(programInfo.uniformLocation.x, (-x));
    webgl.uniform1f(programInfo.uniformLocation.y, (y * 0.4));
    webgl.drawArrays(webgl.TRIANGLES, 3, 3);
    window.requestAnimationFrame(draw);
}
function stopstart() {
    start *= -1;
}

// function to initialize shader program
function initShader(webgl, vsSource, fsSource)
{
    const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fsSource);

    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);
    
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS))
    {
        alert(`
        Program Link Error ${webgl.getProgramInfoLog(program)}
        `);

        return;
    }
    
    return (program);
}

// function to load shader of specified type
function loadShader(webgl, type, source) {
    const shader = webgl.createShader(type);
    webgl.shaderSource(shader, source);
    webgl.compileShader(shader);
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        alert(`
        compile-error ${webgl.getShaderInfoLog(shader)}
        `);
        webgl.deleteShader(shader);
        return;
    }

    return (shader);
}

// create buffer and init buffer
function initBuffers(webgl) {
    const vertices =
        [ // x, y           R,G,B
            0.0, 0.5,       1.0, 0.2, 0.0,
            -0.25, 0.0,     0.3, 1.0, 0.2,
            0.25, 0.0,      0.1, 0.0, 1.0,
            
            // -1.0, -0.5,       1.0, 0.2, 0.0,
            // -0.75, 0.0,     0.3, 1.0, 0.2,
            // -0.5, -0.5,      0.1, 0.0, 1.0
        ];
    
    const buffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
    webgl.bufferData(
        webgl.ARRAY_BUFFER,
        new Float32Array(vertices),
        webgl.STATIC_DRAW
    );

    return (vertices);
}


//
// main render loop
//

const canvas = document.getElementById(`glcanvas`);
const webgl = canvas.getContext(`webgl`);

if (!webgl) {
    throw new Error("WebGL not available/supported");
}
webgl.clearColor(0.75, 0.85, 0.8, 1.0);
// depth buffer is used to order items in the z-dimension
// the higher the value, the closer the item is to the screen
webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);

// initialize a shader program
const program = initShader(webgl, vsSource, fsSource);
// initialize program info
const programInfo = {
    buffer: initBuffers(webgl),
    attribLocation: {
        pos: webgl.getAttribLocation(program, `pos`),
        vcolor: webgl.getAttribLocation(program, `vertColor`),
    },
    uniformLocation: {
        x: webgl.getUniformLocation(program, `x`),
        y: webgl.getUniformLocation(program, `y`),
    }
}
// use program
webgl.useProgram(program);
// enable and specify attribute layout
webgl.enableVertexAttribArray(programInfo.attribLocation.pos);
webgl.vertexAttribPointer(
    programInfo.attribLocation.pos,
    2,
    webgl.FLOAT,
    webgl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
)
webgl.enableVertexAttribArray(programInfo.attribLocation.vcolor);
webgl.vertexAttribPointer(
    programInfo.attribLocation.vcolor,
    3,
    webgl.FLOAT,
    webgl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
)

console.log(programInfo.buffer);
// drawArrays uses the buffer currently bound to memory
//console.log(programInfo);
draw();
