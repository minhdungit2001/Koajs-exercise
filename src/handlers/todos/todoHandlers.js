const {
  getList: getListTodos,
  getManyByIds: getManyByIdsTodos,
  createOne: createOneTodo,
  deleteManyByIds: deleteManyByIdsTodos,
  countAll: countAllTodos,
  updateManyByIds: updateManyByIdsTodos,
} = require("../../database/todoRepository");

/**
 * Get todos from db
 * @param ctx
 * @returns {Promise<void>}
 */
async function getList(ctx) {
  try {
    const { limit, sort, fields, offset } = ctx.request.query;

    const todos = getListTodos({
      limit,
      sort,
      fields,
      offset,
    });

    ctx.body = {
      data: todos,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

/**
 * Get todo by id
 * @param ctx
 * @returns {Promise<{data: todo}>}
 */
async function getOne(ctx) {
  try {
    const { id } = ctx.params;
    const currentTodos = getManyByIdsTodos([+id]);
    if (currentTodos) {
      return (ctx.body = {
        data: currentTodos,
      });
    }

    throw new Error("Todos Not Found with that id!");
  } catch (e) {
    ctx.status = 404;
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Create a new todo
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function createOne(ctx) {
  try {
    const newData = ctx.request.body;
    createOneTodo(newData);

    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update a todo
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function updateManyByIds(ctx) {
  try {
    const { data, ids } = ctx.request.body;

    const existTodos = getManyByIdsTodos(ids);
    if (!existTodos || existTodos.length === 0) {
      throw new Error(`Todos Not Found with ids: ${JSON.stringify(ids)}`);
    }

    updateManyByIdsTodos(ids, data);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Delete many todo by ids
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function deleteManyByIds(ctx) {
  try {
    const { ids } = ctx.request.body;

    const existTodos = getManyByIdsTodos(ids);
    if (!existTodos || existTodos.length === 0) {
      throw new Error(`Todos Not Found with that ids: ${JSON.stringify(ids)}`);
    }

    deleteManyByIdsTodos(ids);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Update a todo
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function updateOne(ctx) {
  try {
    const postData = ctx.request.body;
    const { id } = ctx.params;

    const currentTodos = getManyByIdsTodos([+id]);
    if (!currentTodos) {
      throw new Error("Todos Not Found with that id!");
    }

    updateManyByIdsTodos([+id], postData);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

/**
 * Delete a todo by id
 * @param ctx
 * @returns {Promise<{success: boolean, error: *}|{success: boolean}>}
 */
async function deleteOne(ctx) {
  try {
    const { id } = ctx.params;

    const currentTodos = getManyByIdsTodos([+id]);
    if (!currentTodos) {
      throw new Error("Todos Not Found with that id!");
    }

    deleteManyByIdsTodos([+id]);

    ctx.status = 200;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    return (ctx.body = {
      success: false,
      error: e.message,
    });
  }
}

module.exports = {
  getList,
  getOne,
  createOne,
  updateManyByIds,
  deleteManyByIds,
  updateOne,
  deleteOne,
};
