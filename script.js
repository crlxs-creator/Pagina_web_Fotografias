// variables y nodos
const items = Array.from(document.querySelectorAll(".carousel-item"));
const carousel = document.querySelector(".carousel");
let current = 0; // índice central
const n = items.length;
const spacing = 280; // separación horizontal entre posiciones (ajusta si quieres más/menos espacio)
const sideScale = 0.92;
const centerScale = 1.28;
const sideRotate = 20; // grados de rotación Y para laterales

// Flechas:
const leftArrow = document.querySelector(".arrow-left");
const rightArrow = document.querySelector(".arrow-right");
if (leftArrow) leftArrow.addEventListener("click", prev);
if (rightArrow) rightArrow.addEventListener("click", next);

// render inicial
render();

// FUNCIONES

function render() {
  // para cada item calculamos delta mínimo (circular) respecto a current
  items.forEach((item, i) => {
    // delta en rango -(n-1)/2 .. (n-1)/2
    let raw = i - current;
    let delta = ((raw + n) % n);
    if (delta > n/2) delta -= n; // ahora delta es el desplazamiento más corto
    // posición X en px basada en spacing
    const x = delta * spacing;
    // rotación según delta
    const rotY = Math.max(-sideRotate, Math.min(sideRotate, -delta * sideRotate));
    // escala según si es centro o lateral o lejano
    let scale = Math.abs(delta) === 0 ? centerScale : (Math.abs(delta) === 1 ? sideScale : 0.75);
    // visibilidad y z-index
    const visible = Math.abs(delta) <= 2; // mostrar hasta ±2 (tú puedes ajustar)
    item.style.zIndex = 100 - Math.abs(delta); // el centro delante
    item.style.opacity = visible ? 1 : 0;
    if (visible) item.classList.add("visible"); else item.classList.remove("visible");

    // transform completo: primero centrado con translate(-50%,-50%), luego mover en X, rotar y escalar
    // usamos translateX con px para posicion exacta
    item.style.transform = `translate(-50%,-50%) translateX(${x}px) rotateY(${rotY}deg) scale(${scale})`;
  });

}

function next() {
  current = (current + 1) % n;
  render();
}
function prev() {
  current = (current - 1 + n) % n;
  render();
}

// SWIPE / MOUSE - más robusto (incluye mousemove para arrastrar suave)
let startX = null;
let isDragging = false;

carousel.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});
carousel.addEventListener("touchend", e => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  handleSwipe(endX);
  isDragging = false;
  startX = null;
});

carousel.addEventListener("mousedown", e => {
  startX = e.clientX;
  isDragging = true;
});
carousel.addEventListener("mouseup", e => {
  if (!isDragging) return;
  handleSwipe(e.clientX);
  isDragging = false;
  startX = null;
});
carousel.addEventListener("mouseleave", () => {
  // si sale del área cancelamos drag
  isDragging = false;
  startX = null;
});

function handleSwipe(endX) {
  if (startX === null) return;
  const diff = endX - startX;
  if (diff > 40) { // swipe a la derecha -> ir a anterior
    prev();
  } else if (diff < -40) { // swipe a la izquierda -> siguiente
    next();
  }
}

