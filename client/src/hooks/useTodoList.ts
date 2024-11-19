import { useState } from "react";
import { Todos, Category, Todo } from "@library/types";

export function useTodoList() {
  const [todos, setTodos] = useState<Todos>([]);

  function addTodo(newTodo: Todo<Category>) {
    setTodos((prev) => [...prev, newTodo]);
  }

  return { todos, addTodo };
}
