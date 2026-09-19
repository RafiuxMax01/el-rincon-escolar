const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    nombreProducto: {
      type: String,
      required: true,
      trim: true,
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La cantidad debe ser un número entero.",
      },
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;