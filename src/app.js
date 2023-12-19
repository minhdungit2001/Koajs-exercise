const Koa = require("koa");
const { koaBody } = require("koa-body");
const render = require("koa-ejs");
const path = require("path");
const configRouter = require("./routes/routes.js");
const cors = require("@koa/cors");

// const { fakeProducts, fakeTodos } = require("./helpers/fakerData.js");
// fakeTodos(100);

const app = new Koa();
app.use(cors());

render(app, {
  root: path.join(__dirname, "views"),
  layout: "layout/template",
  viewExt: "html",
  cache: false,
  debug: false,
});

app.use(
  koaBody({
    parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
  })
);
configRouter(app);

app.listen(5000);
