const Router = require("koa-router");
const handlers = require("../handlers/products/productHandlers");
const {
  inputCreateMiddleware,
  inputUpdateMiddleware,
} = require("../middleware/productInputMiddleware");
const {
  inputQueryGetAllMiddleware,
} = require("../middleware/baseQueryMiddleware");

// Prefix all routes with /products

const router = new Router({});
// Routes will go here
router.get("/view/products/new", handlers.viewAddNew);
router.get("/view/products/:id", handlers.viewUpdate);
router.get("/view/products", inputQueryGetAllMiddleware, handlers.viewList);

router.get("/api/products", inputQueryGetAllMiddleware, handlers.getList);
router.get("/api/products/:id", handlers.getOne);
router.post("/api/products", inputCreateMiddleware, handlers.createOne);
router.put("/api/products/:id", inputUpdateMiddleware, handlers.updateOne);
router.delete("/api/products/:id", handlers.deleteOne);

module.exports = router;
