let productosCache = [];

async function cargarProductos() {
  const inventario = document.getElementById("inventario");

  try {
    const respuesta = await fetch("/productos");

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener los productos");
    }

    const productos = await respuesta.json();
    productosCache = productos;

    if (productos.length === 0) {
      inventario.innerHTML = "<p>No hay productos registrados.</p>";
    } else {
      const totalAlertas = productos.filter(
        producto => producto.stockBajo
      ).length;

      const resumen = totalAlertas === 0
        ? `<p class="resumen-alertas sin-alertas" role="status">
             Todos los productos están por encima de su stock mínimo.
           </p>`
        : `<p class="resumen-alertas" role="alert">
             ${totalAlertas === 1
               ? "1 producto está por debajo de su stock mínimo."
               : `${totalAlertas} productos están por debajo de su stock mínimo.`}
           </p>`;

      inventario.innerHTML = resumen + productos.map(producto => {
        const stockBajo = producto.stockBajo;

        return `
          <article class="producto ${stockBajo ? "producto-alerta" : ""}">
            <h3>${producto.nombre}</h3>

            ${stockBajo
              ? `<p class="alerta-stock" role="alert">
                   Bajo inventario: reabastecer
                 </p>`
              : ""}

            <p>Precio: $${producto.precio}</p>

            <p>Stock disponible: ${producto.stock}</p>

            <form class="stock-minimo-form" data-producto-id="${producto._id}">
              <label>
                Stock mínimo:
                <input
                  name="stockMinimo"
                  type="number"
                  min="0"
                  step="1"
                  value="${producto.stockMinimo}"
                  required
                >
              </label>

              <button type="submit">Guardar</button>

              <span class="mensaje-formulario" role="status"></span>
            </form>

            <p class="${stockBajo ? "stock-bajo" : ""}">
              Estado: ${stockBajo ? "Reabastecer" : "Disponible"}
              (mínimo: ${producto.stockMinimo})
            </p>
          </article>
        `;
      }).join("");
    }

    llenarSelectProductos(productos);

    document.querySelectorAll(".stock-minimo-form").forEach(formulario => {
      formulario.addEventListener("submit", actualizarStockMinimo);
    });

  } catch (error) {
    console.error(error);

    inventario.innerHTML = `
      <p>
        No fue posible cargar el inventario.
      </p>
    `;
  }
}

function llenarSelectProductos(productos) {
  const select = document.getElementById("producto-select");

  select.innerHTML =
    '<option value="">Selecciona un producto</option>' +
    productos.map(producto =>
      `<option value="${producto._id}">${producto.nombre} (stock: ${producto.stock})</option>`
    ).join("");
}

async function registrarVenta(event) {
  event.preventDefault();

  const mensaje = document.getElementById("mensaje-venta");
  const productoId = document.getElementById("producto-select").value;
  const cantidad = Number(
    document.getElementById("cantidad-input").value
  );

  mensaje.textContent = "";
  mensaje.className = "";

  if (!productoId) {
    mensaje.textContent = "Selecciona un producto.";
    mensaje.className = "mensaje-error";
    return;
  }

  try {
    const respuesta = await fetch("/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productoId,
        cantidad
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent =
        datos.error || "No se pudo registrar la venta.";
      mensaje.className = "mensaje-error";
      return;
    }

    mensaje.textContent =
      `Venta registrada: ${datos.producto.nombre} (nuevo stock: ${datos.producto.stock})`;

    mensaje.className = "mensaje-exito";

    document.getElementById("form-venta").reset();

    cargarProductos();

  } catch (error) {
    console.error(error);

    mensaje.textContent =
      "Error al conectar con el servidor.";

    mensaje.className = "mensaje-error";
  }
}

document
  .getElementById("form-venta")
  .addEventListener("submit", registrarVenta);

async function actualizarStockMinimo(evento) {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const entrada = formulario.elements.stockMinimo;
  const mensaje = formulario.querySelector(".mensaje-formulario");
  const stockMinimo = Number(entrada.value);

  if (!Number.isFinite(stockMinimo) || stockMinimo < 0) {
    mensaje.textContent = "Usa un valor mayor o igual a 0.";
    return;
  }

  mensaje.textContent = "Guardando...";

  try {
    const respuesta = await fetch(
      `/productos/${formulario.dataset.productoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stockMinimo
        })
      }
    );

    if (!respuesta.ok) {
      const resultado = await respuesta.json();

      throw new Error(
        resultado.error || "No se pudo guardar el stock mínimo"
      );
    }

    mensaje.textContent = "Guardado";

    await cargarProductos();

  } catch (error) {
    mensaje.textContent = error.message;
  }
}

cargarProductos();