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
function getList({ fields, offset = 0, limit = DEFAULT_LIMIT, sort = "desc" }) {
  let resultProducts = products;

  resultProducts = sortDatasByCreatedAt(resultProducts, sort);
  resultProducts = getWithLimitOffset({ datas: resultProducts, limit, offset });
  resultProducts = mapDatasWithFields(resultProducts, fields);

  return resultProducts;
}

function getManyByIds(ids) {
  return products.filter((product) => ids.includes(product.id));
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
    newDatas = datas.map((data) => {
      let newData = {};
      for (let key of fields) {
        if (data[key] !== undefined) newData[key] = data[key];
      }
      return newData;
    });
  }
  return newDatas;
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
function createOne(data) {
  const newProduct = { ...data };

  newProduct.createdAt = new Date();
  newProduct.id = getNewId();
  !data.status ? (newProduct.status = "pending") : null;
  !data.isCompleted ? (newProduct.isCompleted = false) : null;

  const updatedProducts = [newProduct, ...products];

  return saveToDb(updatedProducts);
}

/**
 * Update many products
 * @param {Array} ids
 * @param {Product} data with several fields
 * @returns
 */
function updateManyByIds(ids, data) {
  let updatedProducts = products.filter((product) => !ids.includes(product.id));
  let newProducts = products
    .filter((product) => ids.includes(product.id))
    .map((product) => ({ ...product, ...data }));

  updatedProducts = [...newProducts, ...updatedProducts];

  return saveToDb(updatedProducts);
}

/**
 * Delete many of products by ids
 * @param {*} id
 * @returns
 */
function deleteManyByIds(ids) {
  let updatedProducts = products.filter((product) => !ids.includes(product.id));

  return saveToDb(updatedProducts);
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

function saveToDb(datas) {
  return fs.writeFileSync(
    "./src/database/products.json",
    JSON.stringify({
      data: datas,
    })
  );
}
module.exports = {
  getOne,
  getList,
  getManyByIds,
  countAll,
  createOne,
  deleteManyByIds,
  updateManyByIds,
};
