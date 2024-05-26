import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';


export class TodosController {
  constructor() {}

  public getTodos = async(req: Request, res: Response) => {
    const todos = await prisma.todo.findMany()
    return res.json(todos);
  };

  public getTodoById = async(req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

    const todo = await prisma.todo.findFirst({
      where:{
        id: id
      }
    })
    
    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = async(req: Request, res: Response) => {

    const [error, createTodoDto]  = CreateTodoDto.create(req.body);
    if (error) return res.status(400).json({error: error})

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });

    res.json(todo);
  };

  public updateTodo = async(req: Request, res: Response) => {
    const id = +req.params.id;
    
    const [error, updateTodoDto] = UpdateTodoDto.update({
      ...req.body, id
    })

    if(error) return res.status(400).json({error});

    const todo = await prisma.todo.findFirst({
      where:{
        id: id
      }
    })

    if (!todo)
      return res
        .status(404)
        .json({ error: "Could not find todo with the provided id" });

    const updatedTodo = await prisma.todo.update({
      where: {
        id: id
      },
      data: updateTodoDto!.values
    })

    res.json(updatedTodo);
  };

  public deleteTodo = async(req: Request, res:Response) => {
    const id = +req.params.id;

    if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

    const todo = await prisma.todo.findFirst({
      where:{
        id:id
      }
    })

    if (!todo)
      return res
        .status(404)
        .json({ error: "Could not find todo with the provided id" });

    const deletedTodo = await prisma.todo.delete({
      where:{
        id:id
      }
    })

    res.json(deletedTodo);
  }
}
