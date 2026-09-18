const inventario = document.getElementById("inventario");

const productoSelect = document.getElementById("producto-select");
const cantidadInput = document.getElementById("cantidad-input");

const formVenta = document.getElementById("form-venta");
const mensajeVenta = document.getElementById("mensaje-venta");

const formProducto = document.getElementById("form-producto");
const mensajeProducto = document.getElementById("mensaje-producto");

const historialBody = document.getElementById("historial-body");
const masVendidos = document.getElementById("mas-vendidos");

const resumenVentas = document.getElementById("resumen-ventas");
const resumenProductos = document.getElementById("resumen-productos");
const resumenIngresos = document.getElementById("resumen-ingresos");

const btnActualizar = document.getElementById("btn-actualizar");
const btnHistorial = document.getElementById("btn-historial");


// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatearMoneda(valor) {
    return Number(valor).toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}


function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short"
    });
}


// ============================================
// CARGAR PRODUCTOS
// ============================================

async function cargarProductos() {

    try {

        const respuesta = await fetch("/productos");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        const productos = await respuesta.json();

        renderizarInventario(productos);
        cargarSelectProductos(productos);

    } catch (error) {

        console.error(error);

        inventario.innerHTML = `
            <p class="error">
                No se pudo cargar el inventario.
            </p>
        `;
    }
}


// ============================================
// MOSTRAR INVENTARIO
// ============================================

function renderizarInventario(productos) {

    if (productos.length === 0) {

        inventario.innerHTML = `
            <p>No hay productos registrados.</p>
        `;

        return;
    }

    inventario.innerHTML = "";

    productos.forEach(producto => {

        const stockBajo =
            producto.stock <= producto.stockMinimo;

        const tarjeta = document.createElement("article");

        tarjeta.className = "producto-card";

        tarjeta.innerHTML = `

            <div class="producto-info">

                <h3>${producto.nombre}</h3>

                <p>
                    Precio:
                    <strong>
                        ${formatearMoneda(producto.precio)}
                    </strong>
                </p>

                <p>
                    Stock actual:
                    <strong>
                        ${producto.stock}
                    </strong>
                </p>

                <p>
                    Stock mínimo:
                    <strong>
                        ${producto.stockMinimo}
                    </strong>
                </p>

                ${
                    stockBajo
                        ? `<span class="alerta-stock">
                            Stock bajo
                           </span>`
                        : `<span class="stock-normal">
                            Stock disponible
                           </span>`
                }

            </div>

            <form
                class="form-reabastecer"
                data-id="${producto._id}"
            >

                <label>
                    Agregar stock
                </label>

                <div class="fila-stock">

                    <input
                        type="number"
                        name="cantidad"
                        min="1"
                        step="1"
                        value="1"
                        required
                    >

                    <button type="submit">
                        Agregar
                    </button>

                </div>

            </form>
        `;

        inventario.appendChild(tarjeta);
    });


    // Eventos para reabastecer
    document
        .querySelectorAll(".form-reabastecer")
        .forEach(form => {

            form.addEventListener("submit", reabastecerProducto);
        });
}


// ============================================
// SELECT DE PRODUCTOS
// ============================================

function cargarSelectProductos(productos) {

    productoSelect.innerHTML = `
        <option value="">
            Selecciona un producto
        </option>
    `;

    productos.forEach(producto => {

        const option = document.createElement("option");

        option.value = producto._id;

        option.textContent =
            `${producto.nombre} — Stock: ${producto.stock}`;

        option.disabled = producto.stock === 0;

        productoSelect.appendChild(option);
    });
}


// ============================================
// CREAR PRODUCTO
// ============================================

formProducto.addEventListener("submit", async event => {

    event.preventDefault();

    mensajeProducto.textContent = "";

    const nombre =
        document.getElementById("nombre-producto").value;

    const precio =
        document.getElementById("precio-producto").value;

    const stock =
        document.getElementById("stock-producto").value;

    const stockMinimo =
        document.getElementById("stock-minimo-producto").value;


    try {

        const respuesta = await fetch("/productos", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nombre,
                precio,
                stock,
                stockMinimo
            })
        });


        const datos = await respuesta.json();


        if (!respuesta.ok) {
            throw new Error(
                datos.error || "No se pudo crear el producto."
            );
        }


        mensajeProducto.textContent =
            datos.mensaje;

        mensajeProducto.className =
            "mensaje exito";


        formProducto.reset();

        document.getElementById("stock-producto").value = 0;
        document.getElementById("stock-minimo-producto").value = 0;


        await cargarProductos();
        await cargarResumen();
        await cargarMasVendidos();
        await cargarHistorial();


    } catch (error) {

        console.error(error);

        mensajeProducto.textContent =
            error.message;

        mensajeProducto.className =
            "mensaje error";
    }
});


// ============================================
// REABASTECER PRODUCTO
// ============================================

async function reabastecerProducto(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const productoId = form.dataset.id;

    const cantidad =
        form.querySelector('input[name="cantidad"]').value;


    try {

        const respuesta = await fetch(
            `/productos/${productoId}/stock`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    cantidad
                })
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            throw new Error(
                datos.error ||
                "No se pudo actualizar el stock."
            );
        }


        alert(datos.mensaje);

        await cargarProductos();


    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// ============================================
// REGISTRAR VENTA
// ============================================

formVenta.addEventListener("submit", async event => {

    event.preventDefault();

    mensajeVenta.textContent = "";

    const productoId =
        productoSelect.value;

    const cantidad =
        cantidadInput.value;


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

            throw new Error(
                datos.error ||
                "No se pudo registrar la venta."
            );
        }


        mensajeVenta.textContent =
            `${datos.mensaje} Total: ${formatearMoneda(datos.venta.total)}`;

        mensajeVenta.className =
            "mensaje exito";


        cantidadInput.value = 1;


        await cargarProductos();
        await cargarResumen();
        await cargarHistorial();
        await cargarMasVendidos();


    } catch (error) {

        console.error(error);

        mensajeVenta.textContent =
            error.message;

        mensajeVenta.className =
            "mensaje error";
    }
});


// ============================================
// RESUMEN
// ============================================

async function cargarResumen() {

    try {

        const respuesta =
            await fetch("/ventas/resumen");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener el resumen."
            );
        }

        const resumen =
            await respuesta.json();


        resumenVentas.textContent =
            resumen.ventasRealizadas;

        resumenProductos.textContent =
            resumen.productosVendidos;

        resumenIngresos.textContent =
            formatearMoneda(
                resumen.ingresosTotales
            );


    } catch (error) {

        console.error(error);

        resumenVentas.textContent = "-";
        resumenProductos.textContent = "-";
        resumenIngresos.textContent = "-";
    }
}


// ============================================
// PRODUCTOS MÁS VENDIDOS
// ============================================

async function cargarMasVendidos() {

    try {

        const respuesta =
            await fetch("/ventas/mas-vendidos");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los productos más vendidos."
            );
        }

        const productos =
            await respuesta.json();


        if (productos.length === 0) {

            masVendidos.innerHTML = `
                <p>
                    Todavía no hay ventas registradas.
                </p>
            `;

            return;
        }


        const lista = document.createElement("div");

        lista.className = "lista-mas-vendidos";


        productos.forEach((producto, indice) => {

            const elemento =
                document.createElement("div");

            elemento.className =
                "mas-vendido-item";


            elemento.innerHTML = `

                <div>

                    <strong>
                        ${indice + 1}. ${producto.nombreProducto}
                    </strong>

                    <span>
                        ${producto.cantidadVendida}
                        unidades vendidas
                    </span>

                </div>

                <strong>
                    ${formatearMoneda(producto.ingresos)}
                </strong>

            `;


            lista.appendChild(elemento);
        });


        masVendidos.innerHTML = "";

        masVendidos.appendChild(lista);


    } catch (error) {

        console.error(error);

        masVendidos.innerHTML = `
            <p class="error">
                No se pudieron cargar los productos más vendidos.
            </p>
        `;
    }
}


// ============================================
// HISTORIAL
// ============================================

async function cargarHistorial() {

    try {

        const respuesta =
            await fetch("/ventas");

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo obtener el historial."
            );
        }

        const ventas =
            await respuesta.json();


        historialBody.innerHTML = "";


        if (ventas.length === 0) {

            historialBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay ventas registradas.
                    </td>
                </tr>
            `;

            return;
        }


        ventas.forEach(venta => {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>
                    ${formatearFecha(venta.fecha)}
                </td>

                <td>
                    ${venta.nombreProducto}
                </td>

                <td>
                    ${venta.cantidad}
                </td>

                <td>
                    ${formatearMoneda(venta.precioUnitario)}
                </td>

                <td>
                    <strong>
                        ${formatearMoneda(venta.total)}
                    </strong>
                </td>

            `;


            historialBody.appendChild(fila);
        });


    } catch (error) {

        console.error(error);

        historialBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al cargar el historial.
                </td>
            </tr>
        `;
    }
}


// ============================================
// BOTONES
// ============================================

btnActualizar.addEventListener(
    "click",
    async () => {

        await cargarProductos();
        await cargarResumen();
        await cargarMasVendidos();
    }
);


btnHistorial.addEventListener(
    "click",
    async () => {

        await cargarHistorial();
        await cargarResumen();
        await cargarMasVendidos();
    }
);


// ============================================
// INICIALIZACIÓN
// ============================================

async function iniciarAplicacion() {

    await cargarProductos();

    await cargarResumen();

    await cargarHistorial();

    await cargarMasVendidos();
}


iniciarAplicacion();