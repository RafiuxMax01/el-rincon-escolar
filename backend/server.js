require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const path = require("path");
const app = express();

app.use(express.json()); // necesario para leer req.body en POST
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.get("/", (req, res) => {
  res.send("El Rincón Escolar - servidor funcionando");
});

app.get("/productos", async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error: "Error al consultar los productos",
    });
  }
});

app.post("/ventas", async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;

    if (!productoId) {
      return res.status(400).json({ error: "Debe indicar el producto." });
    }

    const cantidadVendida = Number(cantidad);

    if (!Number.isInteger(cantidadVendida) || cantidadVendida <= 0) {
      return res.status(400).json({
        error: "La cantidad vendida debe ser un número entero mayor a 0.",
      });
    }

    const producto = await Product.findById(productoId);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    if (cantidadVendida > producto.stock) {
      return res.status(400).json({
        error: `Stock insuficiente. Stock disponible: ${producto.stock}`,
      });
    }

    producto.stock -= cantidadVendida;
    await producto.save();

    res.json({
      mensaje: "Venta registrada correctamente",
      producto,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de producto inválido." });
    }
    res.status(500).json({ error: "Error al registrar la venta." });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();