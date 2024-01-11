const canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d");

let prevX = null;
let prevY = null;
let draw = false;

ctx.lineWidth = 5;
ctx.strokeStyle = "#000"; // Default color

window.addEventListener("mousedown", (e) => draw = true);
window.addEventListener("mouseup", (e) => draw = false);

let clrs = document.querySelectorAll(".clr");
clrs = Array.from(clrs);

clrs.forEach(clr => {
    clr.addEventListener('click', (e) => {
        ctx.strokeStyle = clr.dataset.clr;
    });
});

let clearBtn = document.querySelector(".clear");
clearBtn.addEventListener('click', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (window.cubeDrawn) {
        window.cubeDrawn = false;
    }
    console.log(window.cubeDrawn);
});

let savebtn = document.querySelector(".save");
savebtn.addEventListener('click', (e) => {
    let data = canvas.toDataURL("image/png");
    let a = document.createElement("a");
    a.href = data;
    a.download = "sketch.png";
    a.click();
});

window.addEventListener("mousemove", (e) => {
    if (prevX == null || prevY == null || !draw) {
        prevX = e.clientX;
        prevY = e.clientY;
        return;
    }
    let currentX = e.clientX;
    let currentY = e.clientY;

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    prevX = currentX;
    prevY = currentY;
});
