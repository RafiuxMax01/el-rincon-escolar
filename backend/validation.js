function esStockMinimoValido(stockMinimo) {
  return (
    typeof stockMinimo === "number" &&
    Number.isFinite(stockMinimo) &&
    stockMinimo >= 0
  );
}

// IN-22: comparar la cantidad disponible contra el stock mínimo.
// IN-23: un producto es de bajo inventario cuando su stock es igual o
// menor a su stock mínimo.
function tieneStockBajo(producto) {
  if (!producto) {
    return false;
  }

  const { stock, stockMinimo } = producto;

  if (
    typeof stock !== "number" ||
    !Number.isFinite(stock) ||
    typeof stockMinimo !== "number" ||
    !Number.isFinite(stockMinimo)
  ) {
    return false;
  }

  return stock <= stockMinimo;
}

module.exports = { esStockMinimoValido, tieneStockBajo };
