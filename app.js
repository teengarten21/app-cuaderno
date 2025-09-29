const canvas = document.getElementById("pad");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let color = "black";

function setColor(c) { color = c; }
function clearCanvas() { ctx.clearRect(0, 0, canvas.width, canvas.height); }

function saveImage() {
  const link = document.createElement("a");
  link.download = "cuaderno.png";
  link.href = canvas.toDataURL();
  link.click();
}

canvas.addEventListener("pointerdown", e => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});
canvas.addEventListener("pointermove", e => {
  if (!drawing) return;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
});
canvas.addEventListener("pointerup", () => drawing = false);
canvas.addEventListener("pointerleave", () => drawing = false);
