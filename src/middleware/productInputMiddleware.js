const yup = require("yup");

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

const isStringNumber = (str) => /^[0-9]+$/.test(str);

async function inputQueryGetAllMiddleware(ctx, next) {
  try {
    const { limit, sort, fields, offset, page } = ctx.request.query;

    const validQuery = {};

    if (isStringNumber(limit)) {
      validQuery.limit = parseInt(limit);
    }
    if (isStringNumber(offset)) {
      validQuery.offset = parseInt(offset);
    }
    if (isStringNumber(page)) {
      validQuery.page = parseInt(page);
    }
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
