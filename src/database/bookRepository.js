const fs = require("fs");
const { data: books } = require("./books.json");

/**
 *
 * @returns {[{author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}, {author: string, name: string, id: number}]}
 */
function getAll() {
  return books;
}

/**
 *
 * @param id
 * @returns {{author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number} | {author: string, name: string, id: number}}
 */
function getOne(id) {
  return books.find((book) => book.id === parseInt(id));
}

/**
 *
 * @param data
 */
function add(data) {
  const updatedBooks = [data, ...books];
  return fs.writeFileSync(
    "./src/database/books.json",
    JSON.stringify({
      data: updatedBooks,
    })
  );
}

module.exports = {
  getOne,
  getAll,
  add,
};
