const { DEFAULT_LIMIT } = require("../const/default");

/**
 * Check string is have number
 * @param {String} str
 * @returns {true | false}
 */
const isStringNumber = (str) => (str ? /^[0-9]+$/.test(str) : false);

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

module.exports = { inputQueryGetAllMiddleware };
