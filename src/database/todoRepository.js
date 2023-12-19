const fs = require("fs");
const { data: todos } = require("./todos.json");
const { DEFAULT_LIMIT } = require("../const/default");

/**
 * Get all todos by filter
 * @param {Number} limit
 * @param {"desc" | "asc"} sort
 * @param {Array<string>} fields
 * @returns {Array<Todo>}
 */
function getList({ fields, offset = 0, limit = DEFAULT_LIMIT, sort = "desc" }) {
  //Nếu không gán giá trị mặc định thì nên kiểm tra trong hàm chính đây
  let resultTodos = todos;

  resultTodos = sortDatasByCreatedAt(resultTodos, sort);
  resultTodos = getWithLimitOffset({ datas: resultTodos, limit, offset });
  resultTodos = pickDatasWithFields(resultTodos, fields);

  return resultTodos;
}

function getManyByIds(ids) {
  return todos.filter((todo) => ids.includes(todo.id));
}

function countAll() {
  return todos.length;
}
/**
 * Sort todos by createdAt
 * @param {Array<Todo>} datas
 * @param {"desc" | "esc"} sort
 * @returns {Array<Todo>}
 */
function sortDatasByCreatedAt(datas, sort = "desc") {
  if (sort === "asc") {
    return [...datas].sort(
      (previous, currrent) =>
        new Date(previous.createdAt) - new Date(currrent.createdAt)
    );
  }
  return [...datas].sort(
    (previous, currrent) =>
      new Date(currrent.createdAt) - new Date(previous.createdAt)
  );
}

/**
 * Get limit datas
 * @param {Array<Todo>} datas
 * @param {Number} limit
 * @returns {Array<Todo>}
 */
function getWithLimitOffset({ datas, limit = DEFAULT_LIMIT, offset = 0 }) {
  let resultDatas = [...datas];
  let validOffset = parseInt(offset);
  let validLimit = parseInt(limit) ? parseInt(limit) : DEFAULT_LIMIT;

  if (offset > datas.length) {
    validOffset = datas.length % validLimit;
  }

  return datas.slice(validOffset, validOffset + validLimit);
}

/**
 * Map todos to tododtos
 * @param {Array<Todo>} datas
 * @param {Array<string>} fields
 * @returns datas tranfer object of todos
 */
function pickDatasWithFields(datas, fields) {
  let newDatas = [...datas];
  if (fields?.length > 0) {
    newDatas = datas.map((data) => {
      let newData = {};
      for (let key of fields) {
        if (data[key] !== undefined) newData[key] = data[key];
      }
      return newData;
    });
  }
  return newDatas;
}

/**
 * Add new todo
 * @param {Todo} data
 * @returns
 */
function createOne(data) {
  const newTodo = { ...data };

  newTodo.createdAt = new Date();
  newTodo.id = getNewId();
  !data.status ? (newTodo.status = "pending") : null;
  !data.isCompleted ? (newTodo.isCompleted = false) : null;

  const updatedTodos = [newTodo, ...todos];

  return saveToDb(updatedTodos);
}

/**
 * Update many todos
 * @param {Array} ids
 * @param {Todo} data with several fields
 * @returns
 */
function updateManyByIds(ids, data) {
  let updatedTodos = todos.filter((todo) => !ids.includes(todo.id));
  let newTodos = todos
    .filter((todo) => ids.includes(todo.id))
    .map((todo) => ({ ...todo, ...data }));

  updatedTodos = [...newTodos, ...updatedTodos];

  return saveToDb(updatedTodos);
}

/**
 * Delete many of todos by ids
 * @param {*} id
 * @returns
 */
function deleteManyByIds(ids) {
  let updatedTodos = todos.filter((todo) => !ids.includes(todo.id));

  return saveToDb(updatedTodos);
}

/**
 * Generate new ID
 * @returns {*} new Id
 */
function getNewId() {
  let sortDescTodos = sortDatasByCreatedAt(todos, "desc");
  if (!sortDescTodos.length) {
    return 1;
  }

  let newId = 1;
  if (typeof sortDescTodos[0].id === "number") {
    newId += sortDescTodos[0].id;
  }

  while (1) {
    const todo = getOne(newId);
    if (!todo) {
      return newId;
    }
    newId++;
  }
}

function saveToDb(datas) {
  return fs.writeFileSync(
    "./src/database/todos.json",
    JSON.stringify({
      data: datas,
    })
  );
}
module.exports = {
  getList,
  getManyByIds,
  countAll,
  createOne,
  deleteManyByIds,
  updateManyByIds,
};
