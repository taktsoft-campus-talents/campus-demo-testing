import { TodoModel } from "@server/models/todos";
import { db } from "@server/utils";
import { Request, Response } from "express";

export async function addTodo(req: Request, res: Response) {
  console.debug("addTodo", req.path);

  if (!req.body) {
    res.status(400).json({ message: "No body!" });
    return;
  }

  const description = req.body.description;
  if (!description) {
    res.status(400).json({ message: "No description!" });
    return;
  }

  const category = req.body.category;
  if (!category) {
    res.status(400).json({ message: "No category!" });
    return;
  }

  await db.connect();
  TodoModel.insertMany({
    description,
    category,
  });

  res.json({ message: "addTodo" });
}
