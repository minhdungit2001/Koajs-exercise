const {
  getList: getListProducts,
  getOne: getOneProduct,
  createOne: createOneProduct,
  updateManyByIds: updateManyByIdsProduct,
  deleteManyByIds: deleteManyByIdsProduct,
  getFields: getFieldsProduct,
  countAll: countAllProducts,
} = require("../../database/productRepository");

/**
 * Render html for Update product
 * @param ctx
 * @returns {Promise<void>}
 *
 */
async function viewUpdate(ctx) {
  try {
    await ctx.render("pages/update", {});
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Render html for create new product
 * @param ctx
 * @returns {Promise<void>}
 *
 */
async function viewAddNew(ctx) {
  try {
    await ctx.render("pages/create", {});
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Render html to see
 * Validate and set default in middleware
 * @param ctx
 * @returns {Promise<void>}
 *
 */
async function viewList(ctx) {
  try {
    const { limit, sort, fields, page } = ctx.request.query;

    const products = getListProducts({
      limit,
      sort,
      fields,
      offset: page * limit,
    });
    const productsCount = countAllProducts();

    return await ctx.render("pages/product", {
      products: products,
      pages: Math.floor(productsCount / limit) + 1,
      currentPage: page,
      limit: limit,
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Get products from db
 * @param ctx
 * @returns {Promise<void>}
 */
async function getList(ctx) {
  try {
    const { limit, sort, fields, offset } = ctx.request.query;

    const products = getListProducts({
      limit,
      sort,
      fields,
      offset,
    });

    ctx.body = {
      data: products,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Get product by id
 * @param ctx
 * @returns {Promise<{data: product}>}
 */
async function getOne(ctx) {
  try {
    const { id } = ctx.params;
    const currentProducts = getOneProduct(id);
    if (currentProducts) {
      return (ctx.body = {
        data: currentProducts,
      });
    }

    throw new Error("Products Not Found with that id!");
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Create a new product
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function createOne(ctx) {
  try {
    const postData = ctx.request.body;
    createOneProduct(postData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update a product
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function updateOne(ctx) {
  try {
    const postData = ctx.request.body;
    const { id } = ctx.params;

    const currentProducts = getOneProduct(id);
    if (!currentProducts) {
      throw new Error("Products Not Found with that id!");
    }

    updateManyByIdsProduct([+id], postData);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Delete a product by id
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function deleteOne(ctx) {
  try {
    const { id } = ctx.params;

    const currentProducts = getOneProduct(id);
    if (!currentProducts) {
      throw new Error("Products Not Found with that id!");
    }

    deleteManyByIdsProduct([+id]);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}
module.exports = {
  getList,
  getOne,
  createOne,
  updateOne,
  deleteOne,
  viewList,
  viewAddNew,
  viewUpdate,
};
