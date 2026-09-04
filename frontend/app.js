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
      inventario.innerHTML = productos.map(producto => {
        const stockBajo = producto.stock <= producto.stockMinimo;

        return `
          <article class="producto">
            <h3>${producto.nombre}</h3>

            <p>Precio: $${producto.precio}</p>

            <p>Stock disponible: ${producto.stock}</p>

            <p>Stock mínimo: ${producto.stockMinimo}</p>

            <p class="${stockBajo ? "stock-bajo" : ""}">
              Estado: ${stockBajo ? "Reabastecer" : "Disponible"}
            </p>
          </article>
        `;
      }).join("");
    }

    llenarSelectProductos(productos);

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

  select.innerHTML = '<option value="">Selecciona un producto</option>' +
    productos.map(producto =>
      `<option value="${producto._id}">${producto.nombre} (stock: ${producto.stock})</option>`
    ).join("");
}

async function registrarVenta(event) {
  event.preventDefault();

  const mensaje = document.getElementById("mensaje-venta");
  const productoId = document.getElementById("producto-select").value;
  const cantidad = Number(document.getElementById("cantidad-input").value);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productoId, cantidad })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mensaje.textContent = datos.error || "No se pudo registrar la venta.";
      mensaje.className = "mensaje-error";
      return;
    }

    mensaje.textContent = `Venta registrada: ${datos.producto.nombre} (nuevo stock: ${datos.producto.stock})`;
    mensaje.className = "mensaje-exito";

    document.getElementById("form-venta").reset();
    cargarProductos();

  } catch (error) {
    console.error(error);
    mensaje.textContent = "Error al conectar con el servidor.";
    mensaje.className = "mensaje-error";
  }
}

document.getElementById("form-venta").addEventListener("submit", registrarVenta);

cargarProductos();