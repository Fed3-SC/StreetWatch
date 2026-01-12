// DATOS DE LOS PRODUCTOS (Objeto con relojes)
const relojes = {
  1: { id: 1, nombre: "Rolex Submariner", precio: 12500 },
  2: { id: 2, nombre: "Casio G-Shock", precio: 180 },
  3: { id: 3, nombre: "Omega Seamaster", precio: 8500 },
  4: { id: 4, nombre: "Tag Heuer Carrera", precio: 4200 },
  5: { id: 5, nombre: "Seiko Presage", precio: 650 },
  6: { id: 6, nombre: "Citizen Eco-Drive", precio: 320 },
  7: { id: 7, nombre: "Casio Vintage", precio: 45 },
  8: { id: 8, nombre: "Tissot PRX", precio: 750 },
}

// CARRITO - Array de objetos guardado en localStorage
let carrito = []

// REFERENCIAS AL DOM
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

// FUNCIONES PRINCIPALES

// Carga el carrito desde localStorage
function cargarCarritoDesdeStorage() {
  const carritoGuardado = localStorage.getItem("carritoRelojes")
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado)
  }
}

// Guarda el carrito en localStorage
function guardarCarritoEnStorage() {
  localStorage.setItem("carritoRelojes", JSON.stringify(carrito))
}

// Renderiza los productos en el HTML
function renderizarProductos() {
  listaProductos.innerHTML = ""

  for (const id in relojes) {
    const reloj = relojes[id]
    const tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta-producto"
    tarjeta.innerHTML = `
      <h3>${reloj.nombre}</h3>
      <p class="precio">$${reloj.precio}</p>
      <p class="info-descuento">5% desc. (2+) | 10% (3+) | 15% (5+)</p>
    `
    listaProductos.appendChild(tarjeta)
  }
}

// Llena el select con las opciones de relojes
function llenarSelectorRelojes() {
  selectorReloj.innerHTML = '<option value="">-- Elige un reloj --</option>'

  for (const id in relojes) {
    const reloj = relojes[id]
    const opcion = document.createElement("option")
    opcion.value = id
    opcion.textContent = `${reloj.nombre} - $${reloj.precio}`
    selectorReloj.appendChild(opcion)
  }
}

// Calcula el precio con descuento segun cantidad
function calcularPrecio(numeroReloj, cantidad) {
  const reloj = relojes[numeroReloj]
  const subtotal = reloj.precio * cantidad
  let descuento = 0
  let porcentajeDescuento = 0

  if (cantidad >= 5) {
    porcentajeDescuento = 15
    descuento = subtotal * 0.15
  } else if (cantidad >= 3) {
    porcentajeDescuento = 10
    descuento = subtotal * 0.1
  } else if (cantidad >= 2) {
    porcentajeDescuento = 5
    descuento = subtotal * 0.05
  }

  const total = subtotal - descuento

  return {
    id: reloj.id,
    nombre: reloj.nombre,
    precio: reloj.precio,
    cantidad: cantidad,
    subtotal: subtotal,
    porcentajeDescuento: porcentajeDescuento,
    descuento: descuento,
    total: total,
  }
}

// Calcula el IVA (21%) sobre un monto
function calcularIVA(monto) {
  const iva = monto * 0.21
  return {
    monto: monto,
    iva: iva,
    totalFinal: monto + iva,
  }
}

// Muestra un mensaje temporal en pantalla
function mostrarMensaje(texto, tipo) {
  divMensaje.textContent = texto
  divMensaje.className = `mensaje ${tipo}`

  setTimeout(() => {
    divMensaje.className = "mensaje"
  }, 3000)
}

// Agrega un producto al carrito
function agregarAlCarrito(compra) {
  const indiceExistente = carrito.findIndex((item) => item.id === compra.id)

  if (indiceExistente !== -1) {
    const nuevaCantidad = carrito[indiceExistente].cantidad + compra.cantidad
    carrito[indiceExistente] = calcularPrecio(compra.id, nuevaCantidad)
  } else {
    carrito.push(compra)
  }

  guardarCarritoEnStorage()
  renderizarCarrito()
}

// Elimina un producto del carrito por indice
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1)
  guardarCarritoEnStorage()
  renderizarCarrito()
  mostrarMensaje("Producto eliminado del carrito", "exito")
}

// Vacia completamente el carrito
function vaciarCarrito() {
  carrito = []
  guardarCarritoEnStorage()
  renderizarCarrito()
  divResultado.className = "resultado"
  mostrarMensaje("Carrito vaciado correctamente", "exito")
}

// Renderiza el carrito en el HTML
function renderizarCarrito() {
  itemsCarrito.innerHTML = ""

  if (carrito.length === 0) {
    itemsCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>'
    totalCarrito.innerHTML = ""
    botonFinalizar.style.display = "none"
    return
  }

  let totalCarritoValor = 0
  let totalIVA = 0

  carrito.forEach((item, indice) => {
    const ivaItem = calcularIVA(item.total)
    totalCarritoValor += ivaItem.totalFinal
    totalIVA += ivaItem.iva

    const divItem = document.createElement("div")
    divItem.className = "item-carrito"
    divItem.innerHTML = `
      <div class="info-item-carrito">
        <h4>${item.nombre}</h4>
        <p>Cantidad: ${item.cantidad} | Precio unit.: $${item.precio}</p>
        ${item.descuento > 0 ? `<p>Descuento (${item.porcentajeDescuento}%): -$${item.descuento.toFixed(2)}</p>` : ""}
      </div>
      <span class="precio-item-carrito">$${item.total.toFixed(2)}</span>
      <button class="boton boton-eliminar" data-indice="${indice}">Eliminar</button>
    `
    itemsCarrito.appendChild(divItem)
  })

  totalCarrito.innerHTML = `
    <p>Subtotal: $${(totalCarritoValor - totalIVA).toFixed(2)}</p>
    <p>IVA (16%): $${totalIVA.toFixed(2)}</p>
    <p class="total-final">TOTAL: $${totalCarritoValor.toFixed(2)}</p>
  `

  botonFinalizar.style.display = "block"
}

// Finaliza la compra y muestra el resumen
function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío", "error")
    return
  }

  let resumenHTML = "<h3>Compra Finalizada</h3>"
  resumenHTML += '<div class="resumen-compra">'
  resumenHTML += "<strong>RESUMEN DE COMPRA</strong><br><br>"

  let totalGeneral = 0

  carrito.forEach((item) => {
    const iva = calcularIVA(item.total)
    totalGeneral += iva.totalFinal

    resumenHTML += `<strong>${item.nombre}</strong><br>`
    resumenHTML += `Precio unitario: $${item.precio}<br>`
    resumenHTML += `Cantidad: ${item.cantidad}<br>`
    resumenHTML += `Subtotal: $${item.subtotal.toFixed(2)}<br>`

    if (item.descuento > 0) {
      resumenHTML += `Descuento (${item.porcentajeDescuento}%): -$${item.descuento.toFixed(2)}<br>`
    }

    resumenHTML += `IVA (16%): $${iva.iva.toFixed(2)}<br>`
    resumenHTML += `Total producto: $${iva.totalFinal.toFixed(2)}<br><br>`
  })

  resumenHTML += "</div>"
  resumenHTML += `<p class="total-compra">TOTAL PAGADO: $${totalGeneral.toFixed(2)}</p>`

  divResultado.innerHTML = resumenHTML
  divResultado.className = "resultado activo"

  carrito = []
  guardarCarritoEnStorage()
  renderizarCarrito()

  mostrarMensaje("Gracias por tu compra", "exito")
}

// EVENTOS

// Evento: Enviar formulario (agregar al carrito)
formularioCompra.addEventListener("submit", (evento) => {
  evento.preventDefault()

  const relojSeleccionado = selectorReloj.value
  const cantidad = Number.parseInt(entradaCantidad.value)

  if (!relojSeleccionado) {
    mostrarMensaje("Por favor, selecciona un reloj", "error")
    return
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    mostrarMensaje("Por favor, ingresa una cantidad válida", "error")
    return
  }

  const compra = calcularPrecio(Number.parseInt(relojSeleccionado), cantidad)
  agregarAlCarrito(compra)

  selectorReloj.value = ""
  entradaCantidad.value = "1"

  mostrarMensaje(`${compra.nombre} agregado al carrito`, "exito")
})

// Evento: Eliminar item del carrito
itemsCarrito.addEventListener("click", (evento) => {
  if (evento.target.classList.contains("boton-eliminar")) {
    const indice = Number.parseInt(evento.target.dataset.indice)
    eliminarDelCarrito(indice)
  }
})

// Evento: Vaciar carrito
botonVaciar.addEventListener("click", vaciarCarrito)

// Evento: Finalizar compra
botonFinalizar.addEventListener("click", finalizarCompra)

// INICIALIZACION
document.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeStorage()
  renderizarProductos()
  llenarSelectorRelojes()
  renderizarCarrito()
})
