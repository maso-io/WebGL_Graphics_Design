// Set constants
const sin = Math.sin;
const cos = Math.cos;

function rotX(a) {
    /**
     * rotX - Rotates about the x-axis by angle `a`
     * a: angle to rotate the point by
     * 
     * Return: matrix to rotate the object in the x-axis
     */
    const rot = [
        1, 0, 0, 0,
        0, cos(a), -sin(a), 0,
        0, sin(a), cos(a), 0,
        0, 0, 0, 1
    ];
    return (rot);
}
function rotY(a) {
    /**
     * rotY - Rotates about the y-axis by angle `a`
     * a: angle to rotate the point by
     * 
     * Return: matrix to rotate the object in the y-axis
     */
    const rot = [
        cos(a), 0, -sin(a), 0,
        0, 1, 0, 0,
        sin(a), 0, cos(a), 0,
        0, 0, 0, 1
    ];
    return (rot);
}
function rotZ(a) {
    /**
     * rotZ - Rotates about the z-axis by angle `a`
     * a: angle to rotate the point by
     * 
     * Return: matrix to rotate the object in the z-axis
     */
    const rot = [
        cos(a), -sin(a), 0, 0,
        sin(a), cos(a), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
    return (rot);
}
function scaleMatrix(f) {
    const scaler = [
        f, 0, 0, 0,
        0, f, 0, 0,
        0, 0, f, 0,
        0, 0, 0, 1
    ];

    return (scaler);
}
const idMatrix = [
    // Define identity matrix
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];


export { idMatrix, scaleMatrix, rotX, rotY, rotZ };