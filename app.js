let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  document.getElementById("comprar").addEventListener("click", finalizarCompra);
});

async function cargarProductos() {
  try {
    const res = await fetch("productos.json");
    const productos = await res.json();
    const contenedor = document.getElementById("productos");

    productos.forEach(producto => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio} x kg</p>
        <button onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">Agregar</button>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function agregarAlCarrito(id, nombre, precio) {
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, cantidad: 1 });
  }
  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderizarCarrito();
}

function renderizarCarrito() {
  const contenedor = document.getElementById("items-carrito");
  contenedor.innerHTML = "";

  let total = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.innerHTML = `
      ${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}
      <button onclick="eliminarDelCarrito(${item.id})">❌</button>
    `;
    contenedor.appendChild(div);
  });

  document.getElementById("total").textContent = `Total: $${total}`;
}

function finalizarCompra() {
  if (carrito.length === 0) {
    Swal.fire("Tu carrito está vacío 😕");
    return;
  }

  Swal.fire({
    title: "¿Confirmar compra?",
    text: "Gracias por comprar en Verdulería Online 🛒",
    icon: "success",
    confirmButtonText: "Aceptar"
  });

  carrito = [];
  renderizarCarrito();
}
