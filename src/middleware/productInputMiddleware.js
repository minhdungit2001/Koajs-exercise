const yup = require("yup");
const { DEFAULT_LIMIT } = require("../const/default");

/**
 * Validate for create new product
 * @param {*} ctx
 * @param {*} next
 */
async function inputCreateMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      name: yup.string().required(),
      price: yup.number().integer().positive(),
      description: yup.string(),
      product: yup.string(),
      color: yup.string(),
      image: yup.string(),
    });

    await schema.validate(postData);
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}

/**
 * Valdidate for update product
 * @param {*} ctx
 * @param {*} next
 */
async function inputUpdateMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      name: yup.string(),
      price: yup.number().integer().positive(),
      description: yup.string(),
      product: yup.string(),
      color: yup.string(),
      image: yup.string(),
    });

    await schema.validate(postData);
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}

/**
 * Check string is have number
 * @param {String} str
 * @returns {true | false}
 */
const isStringNumber = (str) => /^[0-9]+$/.test(str);

/**
 * Validate and format string query to match type
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function inputQueryGetAllMiddleware(ctx, next) {
  try {
    const { limit, sort, fields, page, offset } = ctx.request.query;
    const validQuery = {};

    validQuery.limit = isStringNumber(limit) ? parseInt(limit) : DEFAULT_LIMIT;
    validQuery.page = isStringNumber(page) ? parseInt(page) : 0;
    validQuery.offset = isStringNumber(offset)
      ? parseInt(offset)
      : validQuery.limit * validQuery.page;

    if ((sort === "desc") | (sort === "asc")) {
      validQuery.sort = sort;
    }
    if (fields) {
      validQuery.fields = fields?.split(",");
    }

    ctx.request.query = validQuery;

    return next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}

module.exports = {
  inputCreateMiddleware,
  inputUpdateMiddleware,
  inputQueryGetAllMiddleware,
};
