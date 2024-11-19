import { Todo } from "@library/types";
import { Request, Response } from "express";

export async function getTodos(req: Request, res: Response) {
  console.debug("getTodos", req.path);

  const newTodo: Todo = {
    id: Math.random(),
    description: "description",
    category: "hobby",
    done: false,
  };

  res.json(newTodo);
}
