const productRoutes = require("./productRoutes");
const todoRoutes = require("./todoRoutes");

// Config router for app
function configRouter(app) {
  app.use(productRoutes.routes());
  app.use(productRoutes.allowedMethods());

  app.use(todoRoutes.routes());
  app.use(todoRoutes.allowedMethods());
}

module.exports = configRouter;
