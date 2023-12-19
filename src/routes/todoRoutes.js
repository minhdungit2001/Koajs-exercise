const Router = require("koa-router");
const handlers = require("../handlers/todos/todoHandlers");
const {
  inputQueryGetAllMiddleware,
} = require("../middleware/baseQueryMiddleware");

const {
  inputCreateMiddleware,
  inputUpdateMiddleware,
} = require("../middleware/todoInputMiddleware");

const router = new Router({});

router.get("/api/todos", inputQueryGetAllMiddleware, handlers.getList);
router.put("/api/todos", inputUpdateMiddleware, handlers.updateManyByIds);
router.delete("/api/todos", handlers.deleteManyByIds);
router.post("/api/todos", inputCreateMiddleware, handlers.createOne);

router.put("/api/todo/:id", handlers.updateOne);
router.delete("/api/todo/:id", handlers.deleteOne);
router.get("/api/todo/:id", handlers.getOne);

module.exports = router;
