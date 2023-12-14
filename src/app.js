const Koa = require("koa");
const { koaBody } = require("koa-body");
const render = require("koa-ejs");
const path = require("path");
const configRouter = require("./routes/routes.js");

// const fakeProduct = require("./helpers/fakerProducts.js");
// fakeProduct(100);

const app = new Koa();

render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout/template",
  viewExt: "html",
  cache: false,
  debug: false,
});

app.use(koaBody());
configRouter(app);

app.listen(5000);
