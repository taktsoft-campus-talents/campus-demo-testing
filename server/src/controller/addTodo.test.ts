import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";
import { db } from "@server/utils";
import { TodoModel } from "@server/models/todos";

vi.mock("@server/utils");
db.connect = vi.fn();

vi.mock("@server/models/todos");
TodoModel.insertMany = vi.fn();

describe("addTodo", () => {
  let req: Request;
  const resJsonSpy = vi.fn();
  const res = {
    status: vi.fn(() => ({
      json: resJsonSpy,
    })),
    json: vi.fn(),
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {} as unknown as Request;
  });

  it("should response with bad request if body is missing", () => {
    addTodo(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(resJsonSpy).toBeCalledWith({ message: "No body!" });
    expect(res.status).toBeCalledTimes(1);
  });

  it("should response with bad request if description is missing", () => {
    req.body = {};
    addTodo(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(resJsonSpy).toBeCalledWith({ message: "No description!" });
    expect(res.status).toBeCalledTimes(1);
  });

  it("should response with bad request if category is missing", () => {
    req.body = {
      description: "test-description",
    };
    addTodo(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(resJsonSpy).toBeCalledWith({ message: "No category!" });
    expect(res.status).toBeCalledTimes(1);
  });

  it("should insert into database and response with message", async () => {
    const testData = {
      description: "test-description",
      category: "test-category",
    };
    req.body = testData;
    await addTodo(req, res);
    expect(db.connect).toBeCalledTimes(1);
    expect(TodoModel.insertMany).toBeCalledTimes(1);
    expect(TodoModel.insertMany).toBeCalledWith(testData);
    expect(res.json).toBeCalled();
    expect(res.json).toBeCalledWith({ message: "addTodo" });
  });
});
