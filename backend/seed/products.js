require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/product");

const productos = [
  {
    nombre: "Cuaderno profesional",
    precio: 45,
    stock: 8,
    stockMinimo: 10,
  },
  {
    nombre: "Lápiz HB",
    precio: 8,
    stock: 25,
    stockMinimo: 10,
  },
  {
    nombre: "Borrador blanco",
    precio: 6,
    stock: 4,
    stockMinimo: 5,
  },
  {
    nombre: "Pluma azul",
    precio: 12,
    stock: 30,
    stockMinimo: 15,
  },
  {
    nombre: "Regla de 30 cm",
    precio: 15,
    stock: 7,
    stockMinimo: 5,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conectado a MongoDB");

    await Product.deleteMany();

    await Product.insertMany(productos);

    console.log("Productos insertados correctamente");

    await mongoose.disconnect();

    console.log("Desconectado de MongoDB");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();