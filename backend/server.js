require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.json());

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

app.put("/productos/:id", async (req, res) => {
  const { stockMinimo } = req.body || {};

  if (typeof stockMinimo !== "number" || !Number.isFinite(stockMinimo) || stockMinimo < 0) {
    return res.status(400).json({
      error: "El stock mínimo debe ser un número mayor o igual a cero",
    });
  }

  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { stockMinimo },
      { new: true, runValidators: true }
    );

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Identificador de producto inválido" });
    }

    res.status(500).json({ error: "Error al actualizar el stock mínimo" });
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