const Router = require("koa-router");
const handlers = require("../handlers/products/productHandlers");
const {
  inputCreateMiddleware,
  inputUpdateMiddleware,
  inputQueryGetAllMiddleware,
} = require("../middleware/productInputMiddleware");

// Prefix all routes with /products

const router = new Router({});
// Routes will go here
router.get("/view/products/new", handlers.viewAddNew);
router.get("/view/products/:id", handlers.viewUpdate);
router.get(
  "/view/products",
  (ctx, next) => inputQueryGetAllMiddleware(ctx, next),
  handlers.viewAll
);

router.get("/api/products", inputQueryGetAllMiddleware, handlers.getProducts);
router.get("/api/products/:id", handlers.getProduct);
router.post("/api/products", inputCreateMiddleware, handlers.save);
router.put("/api/products/:id", inputUpdateMiddleware, handlers.update);
router.delete("/api/products/:id", handlers.deleteOne);

module.exports = router;
