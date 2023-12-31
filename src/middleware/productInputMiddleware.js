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

module.exports = {
  inputCreateMiddleware,
  inputUpdateMiddleware,
};
