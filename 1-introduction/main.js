
// get canvas and webgl context
const ctx = {
    canvas: document.getElementById(`glcanva`),
    webgl: document.getElementById(`glcanva`).getContext(`webgl`)
}
const canvas = document.getElementById(`glcanva`)
const webgl = canvas.getContext(`webgl`)
// Define sources
const vsSource = `
precision mediump float;
attribute vec2 pos;
attribute vec3 vertColor;

uniform float y;
uniform float x;

varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = vec4(pos, 0.0, 1.0) + vec4(x, y, 0.0, 0.0);
    gl_PointSize = 25.0;
}
`
const fsSource = `
precision mediump float;

varying vec3 fragColor;

void main(){
    gl_FragColor = vec4(fragColor, 1.0);
}
`
// Create and return shader program
function initShader(webgl, vsSource, fsSource) {
    //
    const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fsSource);

    // create shader program
    const program = webgl.createProgram();
    webgl.attachShader(program, vertexShader);
    webgl.attachShader(program, fragmentShader);
    webgl.linkProgram(program);

    // check if shader compiled
    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
        alert(
            `unable to initialize shader program: ${webgl.getProgramInfoLog(program)}`
        );
        return (null);
    }
    // return shader program
    return (program);
}

function loadShader(webgl, type, source) {
    // create shader
    const shader = webgl.createShader(type);
    // add shader source to shader
    webgl.shaderSource(shader, source);
    // compile shader
    webgl.compileShader(shader);
    // if compilation fails delete shader
    if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
        alert(
            `An error occured compiling the shader: ${webgl.getShaderInfoLog(shader)}`
        );
        webgl.deleteShader(shader);

        return (null);
    }
    // return shader
    return (shader);
}

function initBuffers() {
    // create buffer for the vertex positions
    const positionBuffer = webgl.createBuffer();

    // select the positionBuffer as the one to apply buffer operations
    // to from here out
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);

    // Now make an array of all the vertices
    const positions = [
        // shape - 1        // Shape color
        -1.0, -1.0,       1.0, 0.0, 0.1,
        -1.0, 1.0,        1.0, 0.0, 0.1,
        1.0, 1.0,         1.0, 0.0, 0.1,
        1.0, -1.0,        1.0, 0.0, 0.1,

        // shape - 2
        - 1.0, 0.0,      0.1, 1.0, 0.4,        
        -0.5, 1.0,       0.1, 1.0, 0.4,
        0.5, 1.0,        0.1, 1.0, 0.4,
        1.0, 0.0,        0.1, 1.0, 0.4,
        0.5, -1.0,       0.1, 1.0, 0.4,
        -0.5, -1.0,      0.1, 1.0, 0.4,

        // shape - 3
        -0.25, 0.0,      0.0, 0.3, 1.0,
        0.0, 0.25,       0.0, 0.3, 1.0,
        0.25, 0.0,       0.0, 0.3, 1.0,

        -0.25, 0.0,     0.2, 0.6, 0.8,
        0.0, -0.25,     0.5, 0.6, 1.0,
        0.25, 0.0,       0.2, 0.6, 0.8
    ];
    
    // supply all the vertex position to the current buffer
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);

    return (positionBuffer);
}

// function to draw your shape
function draw(webgl, shape, offset_val, v_count)
{
    var offset = offset_val;
    var vertexCount = v_count;
    webgl.drawArrays(shape, offset, vertexCount);
}


function drawObject(webgl, programInfo) {
    // Clear the canvas
    webgl.clearColor(1.0, 1.0, 0.0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    draw(webgl, webgl.POINTS, 0, 4);
    draw(webgl, webgl.LINE_LOOP, 4, 6);
    draw(webgl, webgl.TRIANGLES, 10, 3);
    draw(webgl, webgl.TRIANGLES, 13, 3);
}

function main() {
    // throw error is webgl is not supported
    if (!webgl) {
        throw new Error('WebGL is not supported/available');
    }
    // set clear color and clear
    webgl.clearColor(1.0, 1.0, 0.0, 1.0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);
    
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    const shaderProgram = initShader(webgl, vsSource, fsSource);
    
    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
        program: [
            shaderProgram,
        ],
        attribLocations: {
            vertex: [
                webgl.getAttribLocation(shaderProgram, `pos`),
            ],
            color: [
                webgl.getAttribLocation(shaderProgram, `vertColor`),
            ]
        },
        buffers: initBuffers(webgl),
        uniformLocation: {
            x: webgl.getUniformLocation(shaderProgram, `x`),
            y: webgl.getUniformLocation(shaderProgram, `y`),
        },
    };

    // build all object to draw

    webgl.enableVertexAttribArray(programInfo.attribLocations.vertex[0]);
    webgl.vertexAttribPointer(
        programInfo.attribLocations.vertex[0],
        2,
        webgl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    webgl.enableVertexAttribArray(programInfo.attribLocations.color[0]);
    webgl.vertexAttribPointer(
        programInfo.attribLocations.color[0],
        3,
        webgl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    
    
    webgl.useProgram(programInfo.program[0]);


    // startdrawing
    drawObject(webgl, programInfo);
}

// start main
main();
