import { useTodoList } from "@client/hooks";
import { Category, Todo } from "@library/types";

export function TodoList() {
  const { todos, addTodo } = useTodoList();

  async function handleAddTodo() {
    const response = await fetch("/api/");
    const data = await response.json();
    const todo = data as unknown as Todo<Category>;
    addTodo(todo);
  }

  return (
    <div>
      <button onClick={handleAddTodo}>add todo</button>
      {todos.map((todo) => (
        <li key={todo.id}>
          id: {todo.id}, description: {todo.description}
        </li>
      ))}
    </div>
  );
}
