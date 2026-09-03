const test = require("node:test");
const assert = require("node:assert/strict");
const { esStockMinimoValido } = require("./validation");

test("acepta diferentes stocks mínimos no negativos", () => {
  assert.equal(esStockMinimoValido(0), true);
  assert.equal(esStockMinimoValido(5), true);
  assert.equal(esStockMinimoValido(12.5), true);
});

test("rechaza stocks mínimos negativos o no numéricos", () => {
  assert.equal(esStockMinimoValido(-1), false);
  assert.equal(esStockMinimoValido("5"), false);
  assert.equal(esStockMinimoValido(Number.NaN), false);
  assert.equal(esStockMinimoValido(Infinity), false);
});