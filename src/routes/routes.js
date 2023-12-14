const bookRoutes = require("./bookRoutes");
const productRoutes = require("./productRoutes");

// Config router for app
function configRouter(app) {
  app.use(bookRoutes.routes());
  app.use(bookRoutes.allowedMethods());

  app.use(productRoutes.routes());
  app.use(productRoutes.allowedMethods());
}

module.exports = configRouter;
