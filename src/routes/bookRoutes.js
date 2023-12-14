const Router = require("koa-router");
const handlers = require("../handlers/books/bookHandlers");
const inputMiddleware = require("../middleware/bookInputMiddleware");

// Prefix all routes with /books

const router = new Router({
  prefix: "/api",
});
// Routes will go here
router.get("/books", handlers.getBooks);
router.get("/books/:id", handlers.getBook);
router.post("/books", inputMiddleware, handlers.save);

module.exports = router;
