require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Product = require("./models/product");
const Sale = require("./models/sale");

const app = express();
const PORT = 3000;

// ============================================
// CONFIGURACIÓN
// ============================================

app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

// ============================================
// FUNCIÓN AUXILIAR
// ============================================

function esStockMinimoValido(stockMinimo) {
  const valor = Number(stockMinimo);

  return Number.isInteger(valor) && valor >= 0;
}

// ============================================
// INICIO
// ============================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

// ============================================
// PRODUCTOS
// ============================================

// Obtener todos los productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Product.find().sort({ nombre: 1 });

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);

    res.status(500).json({
      error: "Error al obtener los productos.",
    });
  }
});

// Crear producto nuevo
app.post("/productos", async (req, res) => {
  try {
    const {
      nombre,
      precio,
      stock,
      stockMinimo,
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        error: "El nombre del producto es obligatorio.",
      });
    }

    const precioProducto = Number(precio);
    const stockProducto = Number(stock);
    const stockMinimoProducto = Number(stockMinimo);

    if (!Number.isFinite(precioProducto) || precioProducto < 0) {
      return res.status(400).json({
        error: "El precio debe ser un número mayor o igual a 0.",
      });
    }

    if (
      !Number.isInteger(stockProducto) ||
      stockProducto < 0
    ) {
      return res.status(400).json({
        error: "El stock debe ser un número entero mayor o igual a 0.",
      });
    }

    if (
      !Number.isInteger(stockMinimoProducto) ||
      stockMinimoProducto < 0
    ) {
      return res.status(400).json({
        error:
          "El stock mínimo debe ser un número entero mayor o igual a 0.",
      });
    }

    const productoExistente = await Product.findOne({
      nombre: nombre.trim(),
    });

    if (productoExistente) {
      return res.status(409).json({
        error: "Ya existe un producto con ese nombre.",
      });
    }

    const producto = await Product.create({
      nombre: nombre.trim(),
      precio: precioProducto,
      stock: stockProducto,
      stockMinimo: stockMinimoProducto,
    });

    res.status(201).json({
      mensaje: "Producto creado correctamente.",
      producto,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    res.status(500).json({
      error: "Error al crear el producto.",
    });
  }
});

// Reabastecer stock
app.patch("/productos/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const cantidad = Number(req.body.cantidad);

    if (
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      return res.status(400).json({
        error: "La cantidad a agregar debe ser un entero mayor a 0.",
      });
    }

    const producto = await Product.findByIdAndUpdate(
      id,
      {
        $inc: {
          stock: cantidad,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado.",
      });
    }

    res.json({
      mensaje: "Stock actualizado correctamente.",
      producto,
    });
  } catch (error) {
    console.error("Error al actualizar stock:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "ID de producto inválido.",
      });
    }

    res.status(500).json({
      error: "Error al actualizar el stock.",
    });
  }
});

// Actualizar stock mínimo
app.put("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { stockMinimo } = req.body;

    if (!esStockMinimoValido(stockMinimo)) {
      return res.status(400).json({
        error:
          "El stock mínimo debe ser un número entero mayor o igual a 0.",
      });
    }

    const producto = await Product.findByIdAndUpdate(
      id,
      {
        stockMinimo: Number(stockMinimo),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado.",
      });
    }

    res.json({
      mensaje: "Stock mínimo actualizado correctamente.",
      producto,
    });
  } catch (error) {
    console.error("Error al actualizar stock mínimo:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "ID de producto inválido.",
      });
    }

    res.status(500).json({
      error: "Error al actualizar el stock mínimo.",
    });
  }
});

// ============================================
// VENTAS
// ============================================

// Registrar venta
app.post("/ventas", async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    if (!productoId) {
      return res.status(400).json({
        error: "Debe indicar el producto.",
      });
    }

    const cantidadVendida = Number(cantidad);

    if (
      !Number.isInteger(cantidadVendida) ||
      cantidadVendida <= 0
    ) {
      return res.status(400).json({
        error: "La cantidad vendida debe ser un número entero mayor a 0.",
      });
    }

    const producto = await Product.findById(productoId);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado.",
      });
    }

    if (cantidadVendida > producto.stock) {
      return res.status(400).json({
        error: `Stock insuficiente. Stock disponible: ${producto.stock}`,
      });
    }

    const precioUnitario = producto.precio;
    const nombreProducto = producto.nombre;
    const total = precioUnitario * cantidadVendida;

    // Registrar la venta en MongoDB
    const venta = await Sale.create({
      productoId: producto._id,
      nombreProducto,
      precioUnitario,
      cantidad: cantidadVendida,
      total,
    });

    // Descontar stock
    producto.stock -= cantidadVendida;

    await producto.save();

    res.status(201).json({
      mensaje: "Venta registrada correctamente.",
      venta,
      producto,
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        error: "ID de producto inválido.",
      });
    }

    res.status(500).json({
      error: "Error al registrar la venta.",
    });
  }
});

// ============================================
// HISTORIAL DE VENTAS
// ============================================

// Obtener historial completo
app.get("/ventas", async (req, res) => {
  try {
    const ventas = await Sale.find()
      .sort({ fecha: -1 })
      .lean();

    res.json(ventas);
  } catch (error) {
    console.error("Error al obtener historial:", error);

    res.status(500).json({
      error: "Error al obtener el historial de ventas.",
    });
  }
});

// ============================================
// RESUMEN
// ============================================

app.get("/ventas/resumen", async (req, res) => {
  try {
    const resultado = await Sale.aggregate([
      {
        $group: {
          _id: null,
          ventasRealizadas: { $sum: 1 },
          productosVendidos: { $sum: "$cantidad" },
          ingresosTotales: { $sum: "$total" },
        },
      },
    ]);

    if (resultado.length === 0) {
      return res.json({
        ventasRealizadas: 0,
        productosVendidos: 0,
        ingresosTotales: 0,
      });
    }

    res.json({
      ventasRealizadas: resultado[0].ventasRealizadas,
      productosVendidos: resultado[0].productosVendidos,
      ingresosTotales: resultado[0].ingresosTotales,
    });
  } catch (error) {
    console.error("Error al obtener resumen:", error);

    res.status(500).json({
      error: "Error al obtener el resumen de ventas.",
    });
  }
});

// ============================================
// PRODUCTOS MÁS VENDIDOS
// ============================================

app.get("/ventas/mas-vendidos", async (req, res) => {
  try {
    const productos = await Sale.aggregate([
      {
        $group: {
          _id: "$productoId",
          nombreProducto: {
            $first: "$nombreProducto",
          },
          cantidadVendida: {
            $sum: "$cantidad",
          },
          ingresos: {
            $sum: "$total",
          },
        },
      },
      {
        $sort: {
          cantidadVendida: -1,
        },
      },
    ]);

    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);

    res.status(500).json({
      error: "Error al obtener los productos más vendidos.",
    });
  }
});

// ============================================
// CONEXIÓN A MONGODB
// ============================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    console.log(
      `Base de datos: ${mongoose.connection.db.databaseName}`
    );

    app.listen(PORT, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
  });