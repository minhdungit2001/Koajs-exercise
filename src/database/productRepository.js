const fs = require("fs");
const { data: products } = require("./products.json");
const { DEFAULT_LIMIT } = require("../const/default");

/**
 * Get all products by filter
 * @param {Number} limit
 * @param {"desc" | "asc"} sort
 * @param {Array<string>} fields
 * @returns {Promise<Array<Product>}
 */
async function getAll({ limit, sort, fields, offset }) {
  let resultProducts = products;

  resultProducts = sortDatasByCreatedAt(resultProducts, sort);
  resultProducts = getLimitOffset(resultProducts, limit, offset);
  resultProducts = mapEnitiesToEntityDtos(resultProducts, fields);

  return resultProducts;
}

async function countAll() {
  return products.length;
}
/**
 * Sort products by createdAt
 * @param {Array<Product>} datas
 * @param {"desc" | "esc"} sort
 * @returns {Array<Product>}
 */
function sortDatasByCreatedAt(datas, sort) {
  let resultDatas = [...datas];
  if (sort === "desc") {
    resultDatas = datas.sort(
      (previous, currrent) =>
        new Date(currrent.createdAt) - new Date(previous.createdAt)
    );
  } else if (sort === "asc") {
    resultDatas = datas.sort(
      (previous, currrent) =>
        new Date(previous.createdAt) - new Date(currrent.createdAt)
    );
  }
  return resultDatas;
}

/**
 * Get limit datas
 * @param {Array<Product>} datas
 * @param {Number} limit
 * @returns {Array<Product>}
 */
function getLimitOffset(datas, limit, offset) {
  let resultDatas = [...datas];
  let validOffset = offset ? parseInt(offset) : 0;
  let validLimit = limit ? parseInt(limit) : DEFAULT_LIMIT;

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
 * @returns data tranfer object of products
 */
function mapEnitiesToEntityDtos(datas, fields) {
  let resultDataDtos = [...datas];
  if (fields?.length > 0) {
    resultDataDtos = datas.map((data) => mapEntityToEntityDto(data, fields));
  }
  return resultDataDtos;
}

/**
 * Map product to product dto
 * @param {Object} data
 * @param {Array<Product>} fields
 * @returns data tranfer object of product
 */
function mapEntityToEntityDto(data, fields) {
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
 * @returns {Promise<Product>}
 */
async function getOne(id) {
  return products.find((product) => product.id === parseInt(id));
}

/**
 * Add new product
 * @param {Product} data
 * @returns
 */
async function addOne(data) {
  const newProduct = { ...data };
  newProduct.createdAt = new Date();
  newProduct.id = await getNewId();

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
async function updateOne(data) {
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
async function deleteOne(id) {
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
 * @returns {Promise<NewId>}
 */
async function getNewId() {
  let sortDescProducts = sortDatasByCreatedAt(products, "desc");
  if (!sortDescProducts.length) {
    return 1;
  }

  let newId = 1;
  if (typeof sortDescProducts[0].id === "number") {
    newId += sortDescProducts[0].id;
  }

  while (1) {
    const product = await getOne(newId);
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
