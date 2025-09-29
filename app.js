// --- Configuración inicial ---
let canvas = document.getElementById("pad");
let ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// --- Variables ---
let color = "black";
let drawing = false;
let lineWidth = 3;

// Páginas tipo libro
let pages = [createEmptyCanvas()];
let currentPage = 0;

// Undo/Redo
let undoStack = [];
let redoStack = [];

// --- Funciones de páginas ---
function createEmptyCanvas() {
  const c = document.createElement("canvas");
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  return c;
}

function showPage(index) {
  document.body.replaceChild(pages[index], canvas);
  canvas = pages[index];
  ctx = canvas.getContext("2d");
  // Limpiar stacks al cambiar de página
  undoStack = [];
  redoStack = [];
  // Reasignar eventos
  setupDrawingEvents();
}

// Páginas siguientes/anteriores
function nextPage() {
  if(currentPage < pages.length - 1) {
    currentPage++;
    showPage(currentPage);
  } else {
    const newPage = createEmptyCanvas();
    pages.push(newPage);
    currentPage++;
    showPage(currentPage);
  }
}

function prevPage() {
  if(currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
}

// --- Configuración lápiz/borrador ---
function setColor(c) {
  color = c;
}

function setEraser() {
  color = "#ffffff"; // color de fondo
}

function setLineWidth(width) {
  lineWidth = width;
}

// --- Deshacer y rehacer ---
function undo() {
  if(undoStack.length > 0) {
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const img = undoStack.pop();
    ctx.putImageData(img, 0, 0);
  }
}

function redo() {
  if(redoStack.length > 0) {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    const img = redoStack.pop();
    ctx.putImageData(img, 0, 0);
  }
}

// --- Guardar imagen ---
function saveImage() {
  const link = document.createElement("a");
  link.download = `cuaderno_page_${currentPage+1}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

// --- Dibujo ---
function setupDrawingEvents() {
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
}

function startDrawing(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
}

function draw(e) {
  if(!drawing) return;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();
}

function stopDrawing() {
  if(drawing) {
    drawing = false;
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoStack = []; // limpiar redo al dibujar
  }
}

// --- Inicializar ---
setupDrawingEvents();
