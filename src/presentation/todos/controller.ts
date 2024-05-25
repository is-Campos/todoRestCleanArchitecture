import { Request, Response } from "express";

const todos = [
  { id: 1, text: "Buy milk", completedAt: new Date() },
  { id: 2, text: "Buy milk2", completedAt: null },
  { id: 3, text: "Buy milk3", completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });

    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: null,
    };

    todos.push(newTodo);
    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res
        .status(404)
        .json({ error: "Could not find todo with the provided id" });

    const { text, completedAt } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    // todo.text = text //! LOS OBJETOS EN JS PASAN POR REFERENCIA, ESTO NO SE DEBERÍA HACER

    todo.text = text || todo.text;
    completedAt === "null"
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    res.json(todo);
  };

  public deleteTodo = (req: Request, res:Response) => {
    const id = +req.params.id;

    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

    const todo = todos.find((todo) => todo.id === id);

    if (!todo)
      return res
        .status(404)
        .json({ error: "Could not find todo with the provided id" });

    todos.splice(todos.indexOf(todo),1 );

    res.json(todo);
  }
}
