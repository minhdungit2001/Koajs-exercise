const { faker } = require("@faker-js/faker");
const { writeToFileJson } = require("./writeFile");

function fakeProducts(numberOfProducts) {
  try {
    const fakeProducts = [];
    for (let i = 1; i <= numberOfProducts; i++) {
      const fakeProduct = {
        id: i,
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence(),
        product: faker.commerce.product(),
        color: faker.color.human(),
        createdAt: faker.date.past().toISOString(),
        image: faker.image.url(),
      };
      fakeProducts.push(fakeProduct);
    }
    writeToFileJson("../database/products.json", {
      data: fakeProducts,
    });
  } catch (error) {
    console.log("fakeProducts error:", error);
  }
}

module.exports = fakeProducts;
