const fs = require("fs");
const { data: products } = require("./products.json");
const { DEFAULT_LIMIT } = require("../const/default");

/**
 * Get all products by filter
 * @param {Number} limit
 * @param {"desc" | "asc"} sort
 * @param {Array<string>} fields
 * @returns {Array<Product>}
 */
function getAll({ fields, offset = 0, limit = DEFAULT_LIMIT, sort = "desc" }) {
  let resultProducts = products;

  resultProducts = sortDatasByCreatedAt(resultProducts, sort);
  resultProducts = getWithLimitOffset({ datas: resultProducts, limit, offset });
  resultProducts = mapDatasWithFields(resultProducts, fields);

  return resultProducts;
}

function countAll() {
  return products.length;
}
/**
 * Sort products by createdAt
 * @param {Array<Product>} datas
 * @param {"desc" | "esc"} sort
 * @returns {Array<Product>}
 */
function sortDatasByCreatedAt(datas, sort = "desc") {
  if (sort === "asc") {
    return [...datas].sort(
      (previous, currrent) =>
        new Date(previous.createdAt) - new Date(currrent.createdAt)
    );
  }
  return [...datas].sort(
    (previous, currrent) =>
      new Date(currrent.createdAt) - new Date(previous.createdAt)
  );
}

/**
 * Get limit datas
 * @param {Array<Product>} datas
 * @param {Number} limit
 * @returns {Array<Product>}
 */
function getWithLimitOffset({ datas, limit = DEFAULT_LIMIT, offset = 0 }) {
  let resultDatas = [...datas];
  let validOffset = parseInt(offset);
  let validLimit = parseInt(limit);

  if (offset > datas.length) {
    validOffset = datas.length % validLimit;
  }

  if (validLimit) {
    resultDatas = datas.slice(validOffset, validOffset + validLimit);
  }

  return resultDatas;
}

/**
 * Map products to productdtos
 * @param {Array<Product>} datas
 * @param {Array<string>} fields
 * @returns datas tranfer object of products
 */
function mapDatasWithFields(datas, fields) {
  let newDatas = [...datas];
  if (fields?.length > 0) {
    newDatas = datas.map((data) => mapDataWithFields(data, fields));
  }
  return newDatas;
}

/**
 * Map product to product dto
 * @param {Object} data
 * @param {Array<Product>} fields
 * @returns data tranfer object of product
 */
function mapDataWithFields(data, fields) {
  if (fields?.length === 0) return;

  let dataDto = {};
  for (let key of fields) {
    if (data[key] !== undefined) dataDto[key] = data[key];
  }
  return dataDto;
}

/**
 * Get one by id
 * @param {*} id
 * @returns {Product}
 */
function getOne(id) {
  return products.find((product) => product.id === parseInt(id));
}

/**
 * Add new product
 * @param {Product} data
 * @returns
 */
function addOne(data) {
  const newProduct = { ...data };
  newProduct.createdAt = new Date();
  newProduct.id = getNewId();

  const updatedProducts = [newProduct, ...products];
  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: updatedProducts,
    })
  );
}

/**
 * Update products
 * @param {Product} data
 * @returns
 */
function updateOne(data) {
  const productId = data?.id ? parseInt(data.id) : null;

  let updatedProducts = products.filter((product) => product.id !== productId);
  updatedProducts = [data, ...updatedProducts];

  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: updatedProducts,
    })
  );
}

/**
 * Delete one of products by id
 * @param {*} id
 * @returns
 */
function deleteOne(id) {
  let updatedProducts = products.filter(
    (product) => product.id !== parseInt(id)
  );
  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: updatedProducts,
    })
  );
}

/**
 * Generate new ID
 * @returns {*} new Id
 */
function getNewId() {
  let sortDescProducts = sortDatasByCreatedAt(products, "desc");
  if (!sortDescProducts.length) {
    return 1;
  }

  let newId = 1;
  if (typeof sortDescProducts[0].id === "number") {
    newId += sortDescProducts[0].id;
  }

  while (1) {
    const product = getOne(newId);
    if (!product) {
      return newId;
    }
    newId++;
  }
}
module.exports = {
  getOne,
  getAll,
  addOne,
  updateOne,
  deleteOne,
  getNewId,
  countAll,
};
