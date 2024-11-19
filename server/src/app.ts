import express, { json } from "express";
import { routerTodos } from "@server/routes";

const app = express();

app.use(json());

app.use("/api/todos", routerTodos);

export const viteNodeApp = app;
