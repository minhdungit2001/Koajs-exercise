const {
  getAll: getAllProducts,
  getOne: getOneProduct,
  addOne: addProduct,
  updateOne: updateProduct,
  deleteOne: deleteOneProduct,
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
async function viewAll(ctx) {
  try {
    const { limit, sort, fields, page } = ctx.request.query;

    const [products, productsCount] = await Promise.all([
      getAllProducts({
        limit,
        sort,
        fields,
        offset: page * limit,
      }),
      countAllProducts(),
    ]);

    return await ctx.render("pages/product", {
      products,
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

//TODO sửa lại phần valid, getProduct có offset or page limit
/**
 * Get products from db
 * @param ctx
 * @returns {Promise<void>}
 */
async function getProducts(ctx) {
  try {
    const { limit, sort, fields, offset } = ctx.request.query;

    const products = await getAllProducts({
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
async function getProduct(ctx) {
  try {
    const { id } = ctx.params;
    const currentProducts = await getOneProduct(id);
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
async function save(ctx) {
  try {
    const postData = ctx.request.body;
    await addProduct(postData);

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
async function update(ctx) {
  try {
    const postData = ctx.request.body;
    const { id } = ctx.params;

    const currentProducts = await getOneProduct(id);
    if (!currentProducts) {
      throw new Error("Products Not Found with that id!");
    }

    await updateProduct({ ...currentProducts, ...postData });

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
function deleteOne(ctx) {
  try {
    const { id } = ctx.params;

    const currentProducts = getOneProduct(id);
    if (!currentProducts) {
      throw new Error("Products Not Found with that id!");
    }

    deleteOneProduct(id);

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
  getProducts,
  getProduct,
  save,
  update,
  deleteOne,
  viewAll,
  viewAddNew,
  viewUpdate,
};
