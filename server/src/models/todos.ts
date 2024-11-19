import { Todo } from "@library/types";
import { model, Schema } from "mongoose";

const todoSchema = new Schema<Todo>({
  description: { type: String },
  category: { type: String },
  done: { type: Boolean },
});

export const TodoModel = model("Todo", todoSchema);
