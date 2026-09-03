async function cargarProductos() {
  const inventario = document.getElementById("inventario");

  try {
    const respuesta = await fetch("/productos");

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener los productos");
    }

    const productos = await respuesta.json();

    if (productos.length === 0) {
      inventario.innerHTML = "<p>No hay productos registrados.</p>";
      return;
    }

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

  } catch (error) {
    console.error(error);

    inventario.innerHTML = `
      <p>
        No fue posible cargar el inventario.
      </p>
    `;
  }
}

cargarProductos();