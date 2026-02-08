// DATOS DE LOS PRODUCTOS
let relojes = [
  { id: 1, nombre: "Rolex Submariner", precio: 12500 },
  { id: 2, nombre: "Casio G-Shock", precio: 180 },
  { id: 3, nombre: "Omega Seamaster", precio: 8500 },
  { id: 4, nombre: "Tag Heuer Carrera", precio: 4200 },
  { id: 5, nombre: "Seiko Presage", precio: 650 },
  { id: 6, nombre: "Citizen Eco-Drive", precio: 320 },
  { id: 7, nombre: "Casio Vintage", precio: 45 },
  { id: 8, nombre: "Tissot PRX", precio: 750 }
]

// CARRITO
let carrito = []

// DOM
const listaProductos = document.getElementById("listaProductos")
const selectorReloj = document.getElementById("selectorReloj")
const entradaCantidad = document.getElementById("entradaCantidad")
const formularioCompra = document.getElementById("formularioCompra")
const divMensaje = document.getElementById("mensaje")
const itemsCarrito = document.getElementById("itemsCarrito")
const totalCarrito = document.getElementById("totalCarrito")
const botonFinalizar = document.getElementById("botonFinalizar")
const botonVaciar = document.getElementById("botonVaciar")
const divResultado = document.getElementById("resultado")

// STORAGE
function cargarCarritoDesdeStorage() {
  const data = localStorage.getItem("carritoRelojes")
  if (data) carrito = JSON.parse(data)
}

function guardarCarritoEnStorage() {
  localStorage.setItem("carritoRelojes", JSON.stringify(carrito))
}

// PRODUCTOS
function renderizarProductos() {
  listaProductos.innerHTML = ""
  relojes.forEach((reloj) => {
    const tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta-producto"
    tarjeta.innerHTML = `
      <h3>${reloj.nombre}</h3>
      <p class="precio">$${reloj.precio}</p>
      <p class="info-descuento">5% (2+) | 10% (3+) | 15% (5+)</p>
    `
    listaProductos.appendChild(tarjeta)
  })
}

// SELECT
function llenarSelectorRelojes() {
  selectorReloj.innerHTML = '<option value="">-- Elige un reloj --</option>'
  relojes.forEach((reloj) => {
    const opcion = document.createElement("option")
    opcion.value = reloj.id
    opcion.textContent = `${reloj.nombre} - $${reloj.precio}`
    selectorReloj.appendChild(opcion)
  })
}

// PRECIOS
function calcularPrecio(id, cantidad) {
  const reloj = relojes.find((r) => r.id === id)
  const subtotal = reloj.precio * cantidad

  let porcentaje = 0
  if (cantidad >= 5) porcentaje = 15
  else if (cantidad >= 3) porcentaje = 10
  else if (cantidad >= 2) porcentaje = 5

  const descuento = subtotal * (porcentaje / 100)
  const total = subtotal - descuento

  return {
    id: reloj.id,
    nombre: reloj.nombre,
    precio: reloj.precio,
    cantidad,
    subtotal,
    porcentajeDescuento: porcentaje,
    descuento,
    total,
  }
}

function calcularIVA(monto) {
  const iva = monto * 0.21
  return { iva, totalFinal: monto + iva }
}

// MENSAJES
function mostrarMensaje(texto, tipo) {
  divMensaje.textContent = texto
  divMensaje.className = `mensaje ${tipo}`
  setTimeout(() => (divMensaje.className = "mensaje"), 3000)
}

// CARRITO
function agregarAlCarrito(compra) {
  const i = carrito.findIndex((item) => item.id === compra.id)
  if (i !== -1) {
    carrito[i] = calcularPrecio(compra.id, carrito[i].cantidad + compra.cantidad)
  } else carrito.push(compra)

  guardarCarritoEnStorage()
  renderizarCarrito()
}

function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1)
  guardarCarritoEnStorage()
  renderizarCarrito()
  mostrarMensaje("Producto eliminado", "exito")
}

function vaciarCarrito() {
  carrito = []
  guardarCarritoEnStorage()
  renderizarCarrito()
  mostrarMensaje("Carrito vaciado", "exito")
}

function renderizarCarrito() {
  itemsCarrito.innerHTML = ""
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = "<p>El carrito está vacío</p>"
    totalCarrito.innerHTML = ""
    botonFinalizar.style.display = "none"
    return
  }

  let total = 0
  let ivaTotal = 0

  carrito.forEach((item, i) => {
    const iva = calcularIVA(item.total)
    total += iva.totalFinal
    ivaTotal += iva.iva

    itemsCarrito.innerHTML += `
      <div>
        <strong>${item.nombre}</strong>
        x${item.cantidad}
        <button class="boton-eliminar" data-indice="${i}">X</button>
      </div>
    `
  })

  totalCarrito.innerHTML = `
    <p>IVA (21%): $${ivaTotal.toFixed(2)}</p>
    <p><strong>Total: $${total.toFixed(2)}</strong></p>
  `

  botonFinalizar.style.display = "block"
}

// EVENTOS
formularioCompra.addEventListener("submit", (e) => {
  e.preventDefault()
  const id = Number(selectorReloj.value)
  const cantidad = Number(entradaCantidad.value)
  if (!id || cantidad <= 0) return mostrarMensaje("Datos inválidos", "error")
  agregarAlCarrito(calcularPrecio(id, cantidad))
  entradaCantidad.value = "1"
})

itemsCarrito.addEventListener("click", (e) => {
  if (e.target.classList.contains("boton-eliminar")) {
    eliminarDelCarrito(Number(e.target.dataset.indice))
  }
})

botonVaciar.addEventListener("click", vaciarCarrito)
botonFinalizar.addEventListener("click", () => mostrarMensaje("Compra finalizada", "exito"))

document.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeStorage()
  renderizarProductos()
  llenarSelectorRelojes()
  renderizarCarrito()
})
