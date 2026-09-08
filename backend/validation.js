function esStockMinimoValido(stockMinimo) {
  return (
    typeof stockMinimo === "number" &&
    Number.isFinite(stockMinimo) &&
    stockMinimo >= 0
  );
}

module.exports = { esStockMinimoValido };