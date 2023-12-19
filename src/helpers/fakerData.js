const { faker } = require("@faker-js/faker");
const { writeToFileJson } = require("./writeFile");

function fakeProducts(datasCount) {
  try {
    const fakeDatas = [];
    for (let i = 1; i <= datasCount; i++) {
      const fakeData = {
        id: i,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence(),
        product: faker.commerce.product(),
        color: faker.color.human(),
        createdAt: faker.date.past().toISOString(),
        image: faker.image.url(),
      };
      fakeDatas.push(fakeData);
    }
    writeToFileJson("../database/products.json", {
      data: fakeDatas,
    });
  } catch (error) {
    console.log("fakeProducts error:", error);
  }
}

function fakeTodos(datasCount) {
  try {
    const fakeDatas = [];
    for (let i = 1; i <= datasCount; i++) {
      const fakeData = {
        id: i,
        text: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["pending", "done"]),
        isCompleted: faker.datatype.boolean(),
        createdAt: faker.date.past().toISOString(),
      };
      fakeDatas.push(fakeData);
    }
    writeToFileJson("../database/todos.json", {
      data: fakeDatas,
    });
  } catch (error) {
    console.log("fakeTodos error:", error);
  }
}

module.exports = {
  fakeProducts,
  fakeTodos,
};
