
let cubeDrawn = false;
// let rotateX = 0;
// let rotateY = 0;
// let rotateZ = 0;
let Qx = Math.PI / 4;
let Qy = Math.PI / 3;
let Qz = Math.PI / 4;
let dx = 0;
let dy = 0;
let dz = 0;
let SIZE = 150;
let vertices = [];

function addPoint(x, y, z) {
    return [x, y, z];
}

let draw3DCubeBtn = document.querySelector(".draw-3d-cube");
draw3DCubeBtn.addEventListener('click', () => {
    drawCube();
    updateCube();
});

vertices.push(addPoint(SIZE, SIZE, SIZE));
vertices.push(addPoint(-SIZE, SIZE, SIZE));
vertices.push(addPoint(-SIZE, -SIZE, SIZE));
vertices.push(addPoint(SIZE, -SIZE, SIZE));

vertices.push(addPoint(SIZE, SIZE, SIZE));
vertices.push(addPoint(SIZE, SIZE, -SIZE));
vertices.push(addPoint(-SIZE, SIZE, -SIZE));
vertices.push(addPoint(-SIZE, -SIZE, -SIZE));

vertices.push(addPoint(SIZE, -SIZE, -SIZE));
vertices.push(addPoint(SIZE, SIZE, -SIZE));
vertices.push(addPoint(SIZE, -SIZE, -SIZE));
vertices.push(addPoint(SIZE, -SIZE, SIZE));

vertices.push(addPoint(-SIZE, -SIZE, SIZE));
vertices.push(addPoint(-SIZE, -SIZE, -SIZE));
vertices.push(addPoint(-SIZE, SIZE, -SIZE));
vertices.push(addPoint(-SIZE, SIZE, SIZE));

function project3D(x, y, z) {
    var xRotQz = x * Math.cos(Qz) + y * Math.sin(Qz);
    var yRotQz = y * Math.cos(Qz) - x * Math.sin(Qz);
    var zRotQz = z;
    var xRotQzQx = xRotQz;
    var yRotQzQx = yRotQz * Math.cos(Qx) + zRotQz * Math.sin(Qx);
    var zRotQzQx = zRotQz * Math.cos(Qx) - yRotQz * Math.sin(Qx);
    var xRotQzQxQy = xRotQzQx * Math.cos(Qy) + zRotQzQx * Math.sin(Qy);
    var yRotQzQxQy = yRotQzQx;
    return [xRotQzQxQy, yRotQzQxQy];
}

function transformXYtoPixels(x, y) {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return [x + centerX, -y + centerY];
}

function drawCube() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var verticesPixLoc = [];

    for (var i = 0; i < vertices.length; i++) {
        var xyLoc = project3D(vertices[i][0], vertices[i][1], vertices[i][2]);
        var pixLoc = transformXYtoPixels(xyLoc[0], xyLoc[1]);
        verticesPixLoc.push(pixLoc);

        ctx.beginPath();
        ctx.arc(pixLoc[0], pixLoc[1], 4, 0, 2 * Math.PI);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
    }

    for (var i = 0; i < vertices.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(verticesPixLoc[i][0], verticesPixLoc[i][1]);
        ctx.lineTo(verticesPixLoc[i + 1][0], verticesPixLoc[i + 1][1]);
        ctx.stroke();
    }
    cubeDrawn = true;
}

function checkIfKeyPressed(e) {
    var step = Math.PI / 4320;

    if (e.keyCode == "39") {
        dy = dy + step;
    } else if (e.keyCode == "37") {
        dy = dy - step;
    } else if (e.keyCode == "40") {
        dx = dx + step;
    } else if (e.keyCode == "38") {
        dx = dx - step;
    }

    e.preventDefault();

    if (cubeDrawn) {
        updateCube();
    }
}

function updateCube() {
    var rate = 0.999;

    dx = rate * dx;
    Qx = Qx + dx;
    dy = rate * dy;
    Qy = Qy + dy;
    dz = rate * dz;
    Qz = Qz + dz;
    drawCube();
    window.requestAnimationFrame(updateCube);
}

window.addEventListener("keydown", checkIfKeyPressed, false);

