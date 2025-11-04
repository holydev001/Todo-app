import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ✅ Fetch all todos
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    return todos.sort((a, b) => b._creationTime - a._creationTime);
  },
});

// ✅ Create a new todo
export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const newTodo = {
      title: args.title,
      completed: false,
      createdAt: Date.now(),
    };
    await ctx.db.insert("todos", newTodo);
  },
});

// ✅ Toggle todo completion
export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");
    await ctx.db.patch(args.id, { completed: !todo.completed });
  },
});

// ✅ Delete a todo
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
