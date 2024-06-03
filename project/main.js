import { initShader, getColor, gameOver } from "./functionality/build.js";
import { sources, eData, pData } from "./sources/sources.js";
import { Box, Plane } from "./functionality/objects.js";
import { sound } from "./assets/sound/sound.js";

const PI = Math.PI;
const canvas = document.getElementById(`canva`);
const intro_s = document.getElementById(`intro`);
const main_s = document.getElementById(`main`);
const end_s = document.getElementById(`ending`);
let score = 0;

/**
 * @type {WebGL2RenderingContext}
 */
const gl = canvas.getContext(`webgl2`);
if (!gl) {
    throw new Error(`WebGL not available/supported`);
}
/**
 * @type {WebGLProgram}
 */
let program;
/**
 * @type {Box[]}
 */
const enemies = [];
/**
 * @type {Plane}
 */
let plane;
export { gl, program, canvas };
    


function main() {
    gl.clearColor(0.985, 0.980, 0.975, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    program = initShader(gl, sources[0], sources[1]);
    gl.useProgram(program);
    
    getPlane(pData);
    getEnemy(eData);

    const r = plane.radius;
    document.addEventListener("keydown", (e) => {
        let x = plane.position[0];
        let y = plane.position[1];
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (y + r + 0.05 < 1) {
                    plane.position[1] += Plane.velY;
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (x > -1) {
                    plane.position[0] -= Plane.velX;
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (x < 1) {
                    plane.position[0] += Plane.velX;
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (y - r > -1) {
                    plane.position[1] -= Plane.velY;
                }
                break;
            default:
                x += Plane.velX * 0.5;
                break;
        }
    });
    //draw();
}

function getPlane(data) {
    plane = new Plane(data, 0.05 * 1.5, [
        // R,   G,   B
        1.0, 0.0, 0.0
    ]);
    plane.position = [-1 + 0.05, 0];
}
function getEnemy(data) {
    enemies.push(
        new Box(data, 0.05, getColor())
    );

}
function draw(timestamp=0) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (Box.gameStatus) {
        plane.collisionDetect(enemies);
        plane.update();
        if (plane.position[0] >= 1) {
            getEnemy(eData);
            plane.position[0] = -1;
            document.getElementById(`score`).style = "display: in-line block;"
            document.getElementById(`score`).textContent = `score: ${++score}`;
        }
        for (const enemy of enemies) {
            enemy.update(timestamp);
            enemy.draw();
        };
        plane.position[0] += Plane.velX * 0.05;
        plane.draw();
        requestAnimationFrame(draw);
    } else {
        gameOver();
        Box.gameStatus = 1;
    }
}

const button = document.querySelector(`.start-button`);
button.addEventListener("click", () => {
    const state = button.getAttribute(`data-state`);
    if (state) {
        intro_s.play();
        end_s.pause();
        canvas.style = "display: block;"
        document.querySelector(`.start`).style = "display: none;"
        draw();
        button.style = "display: none;"
    }
    if (state == 2) {
        for (let i = 0; i < enemies.length; i++) {
            enemies.pop();
            console.log(`i: ${i}`);
            Box.ID--;
        }
        plane.position[0] = -1;
        plane.position[1] = 0; 
        document.getElementById(`game-over`).style = "display: none;"
        score = 0;
        document.getElementById(`score`).textContent = `score: ${score++}`;
    }
})

intro_s.addEventListener("ended", () => {
    if (Box.gameStatus) {
        main_s.play();
    }
})

main();