const relojes = {
  1: { nombre: "Reloj Deportivo", precio: 250 },
  2: { nombre: "Reloj Clásico", precio: 450 },
  3: { nombre: "Reloj Smartwatch", precio: 600 },
  4: { nombre: "Reloj Digital", precio: 180 },
}

let carrito = 0

function seleccionarReloj() {
  let mensaje = "Selecciona un reloj:\n\n"
  mensaje += "1. Reloj Deportivo - $250\n"
  mensaje += "2. Reloj Clásico - $450\n"
  mensaje += "3. Reloj Smartwatch - $600\n"
  mensaje += "4. Reloj Digital - $180\n\n"
  mensaje += "Ingresa el número (1-4):"

  let opcion = prompt(mensaje)

  if (opcion === null) return null

  opcion = Number.parseInt(opcion)

  if (opcion >= 1 && opcion <= 4) {
    return opcion
  } else {
    alert("Opción inválida. Elige un número entre 1 y 4.")
    return null
  }
}

function calcularPrecio(numeroReloj, cantidad) {
  const reloj = relojes[numeroReloj]
  const subtotal = reloj.precio * cantidad
  let descuento = 0

  
  if (cantidad >= 5) {
    descuento = subtotal * 0.15 
  } else if (cantidad >= 3) {
    descuento = subtotal * 0.1 
  } else if (cantidad >= 2) {
    descuento = subtotal * 0.05 
  }

  const total = subtotal - descuento

  return {
    nombre: reloj.nombre,
    precio: reloj.precio,
    cantidad: cantidad,
    subtotal: subtotal,
    descuento: descuento,
    total: total,
  }
}

function calcularIVA(monto) {
  const iva = monto * 0.16
  return {
    monto: monto,
    iva: iva,
    totalFinal: monto + iva,
  }
}

function generarResumen(compra, iva) {
  let resumen = "=== RESUMEN DE COMPRA ===\n\n"
  resumen += `Producto: ${compra.nombre}\n`
  resumen += `Precio unitario: $${compra.precio}\n`
  resumen += `Cantidad: ${compra.cantidad}\n`
  resumen += `Subtotal: $${compra.subtotal.toFixed(2)}\n`

  if (compra.descuento > 0) {
    resumen += `Descuento: -$${compra.descuento.toFixed(2)}\n`
  }

  resumen += `Antes de IVA: $${compra.total.toFixed(2)}\n`
  resumen += `IVA (16%): $${iva.iva.toFixed(2)}\n`
  resumen += `TOTAL: $${iva.totalFinal.toFixed(2)}\n`

  return resumen
}

function iniciarCompra() {
  const confirmar = confirm("¿Deseas realizar una compra?")

  if (!confirmar) {
    console.log("Compra cancelada por el usuario.")
    return
  }

  let seguirComprando = true
  carrito = 0

  console.log("=== INICIANDO COMPRA ===")


  while (seguirComprando) {
    const numeroReloj = seleccionarReloj()

    if (numeroReloj === null) {
      break
    }

  
    const cantidadStr = prompt(`¿Cuántos ${relojes[numeroReloj].nombre.toLowerCase()}s deseas?`)

    if (cantidadStr === null) break

    const cantidad = Number.parseInt(cantidadStr)

  
    if (isNaN(cantidad) || cantidad <= 0) {
      console.log("ERROR: Cantidad inválida. Por favor ingresa un número válido.")
      continue
    }

 
    const compra = calcularPrecio(numeroReloj, cantidad)
    const iva = calcularIVA(compra.total)
    const resumen = generarResumen(compra, iva)

    console.log(resumen)

    carrito += iva.totalFinal

  
    seguirComprando = confirm("¿Deseas comprar otro reloj?")
  }

  if (carrito > 0) {
    console.log("=== COMPRA FINALIZADA ===")
    console.log(`TOTAL CARRITO: $${carrito.toFixed(2)}`)
  } else {
    console.log("No se realizó compra.")
  }
}
