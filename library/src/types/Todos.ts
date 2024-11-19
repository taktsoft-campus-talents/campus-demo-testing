export type Category = "shopping" | "learning" | "hobby";

export type Todo = {
  id: number;
  description: string;
  done: boolean;
  category: Category;
};

export type Todos = Todo[];
