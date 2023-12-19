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
      text: yup.string().required(),
      status: yup.string().oneOf(["pending", "done"]),
      isCompleted: yup.boolean(),
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
      text: yup.string(),
      status: yup.string().oneOf(["pending", "done"]),
      isCompleted: yup.boolean(),
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
