# Component Testing & Unit Testing 🎯

Learning goals:

- Vitest
- Unit Testing
- Component Testing
- React Testing Library

See:

- https://vitest.dev/guide/

A similar testing library is Jest.

## Setup Vitest

- install the library
- create a test file
- run tests

See: https://vitest.dev/guide/

## First Sample Test

```ts
// server/src/controller/addTodo.ts
import { Request, Response } from "express";

export function addTodo(req: Request, res: Response) {
  console.debug("addTodo", req.path);
  res.json({ message: "addTodo" });
}
```

```ts
// server/src/controller/addTodo.test.ts
import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";

describe("addTodo", () => {
  it("should return a message", () => {
    const req = { path: "/addTodo" } as Request;
    const res = { json: vi.fn() } as unknown as Response;
    addTodo(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: "addTodo" });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
```

- `describe` and `it` (or `test`) are used to define test suites and test cases.
- `vi` provides utility functions.
- `vi.fn()` is used to create a mock function.
- `expect` is used to define assertions.
- `toHaveBeenCalledWith` is used to check if the function was called with specific arguments.
- `toHaveBeenCalledTimes` is used to check how often a function was called.

## Behavior-Driven Development (BDD)

- Focus on Behavior:
  - Tests are written to describe the expected behavior of a function, component, or system.
  - Example: it("should return a message") explains what the function should do under specific conditions.
- Readable and Expressive:
  - The phrasing (it should) makes test cases easy to read, even for non-developers, aligning with BDD’s goal of fostering collaboration between developers, testers, and business stakeholders.
- Encourages Test-Driven Development (TDD):
  - By focusing on the “what” rather than the “how”, developers are encouraged to think about desired outcomes before writing the implementation.

## Commands

```sh
npx vitest --help
npx vitest # run tests in watch mode
npx vitest --coverage # run tests and generate coverage report
npx vitest --coverage --reporter html # generate HTML coverage report
npx vite preview --outDir html # view HTML coverage report
```

## Test Coverage

## Development / Debugging

```ts
import { Request, Response } from "express";

export function addTodo(req: Request, res: Response) {
  console.debug("addTodo", req.path);
  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }
  const description = req.body.description;
  const title = req.body.title;
  console.debug("description:", description);
  console.debug("title:", title);
  res.json({ message: "addTodo" });
}
```

```ts
it.only("should return request error if there is no body", () => {
  const req = { path: "/addTodo" } as Request;
  const jsonFn = vi.fn();
  const res = {
    status: vi.fn(() => ({ json: jsonFn })),
  } as unknown as Response;
  addTodo(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(jsonFn).toHaveBeenCalledTimes(1);
});
```

- `it.only` and `describe.only` can be used to run only specific tests.
- A `mock` is a fake implementation of a function or object that can be used to test other functions or objects.

## VS Code Integration

Plugin: https://vitest.dev/guide/ide

- execute single test
- show coverage in code
- set breakpoints / debugging

## Test (alias it) functions

```ts
it.todo("should return a message", () => {});
```

- https://vitest.dev/api/#test

The most common test functions are:

- `only` - run only this test during development
- `skip` - skip this test - uncomment
- `todo` - mark this test as todo

Good to know, but less common:

- `each` (take care of complex code)

## Test Lifecycle

These functions allow you to hook into the life cycle of tests to avoid repeating setup and teardown code. They apply to the current context.

- https://vitest.dev/api/#beforeeach
- https://vitest.dev/api/#aftereach
- https://vitest.dev/api/#beforeall
- https://vitest.dev/api/#afterall

## Mock Helper Functions

- https://vitest.dev/api/vi.html#vi-clearallmocks
- https://vitest.dev/api/vi.html#vi-resetallmocks
- https://vitest.dev/api/vi.html#vi-restoreallmocks

Sample:

```ts
beforeEach(() => {
  vi.clearAllMocks();
  // or
  vi.resetAllMocks();
  vi.restoreAllMocks();
});
```

## Sample Code

```ts
import { TodoModel } from "@server/models/todos";
import { db } from "@server/utils";
import { Request, Response } from "express";

export async function addTodo(req: Request, res: Response) {
  console.debug("addTodo", req.path);

  if (!req.body) {
    res.status(400).json({ message: "No body" });
    return;
  }

  const description = req.body.description;
  if (!description) {
    res.status(400).json({ message: "No description" });
    return;
  }

  const title = req.body.title;
  if (!title) {
    res.status(400).json({ message: "No title" });
    return;
  }

  console.debug("description:", description);
  console.debug("title:", title);

  await db.connect();
  const result = await TodoModel.insertMany({ description, title });
  console.debug("result:", result);

  res.json({ message: "addTodo" });
}
```

```ts
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";

describe("addTodo", () => {
  const req = { path: "/addTodo" } as Request;
  const statusJsonFn = vi.fn();
  const jsonFn = vi.fn();
  const res = {
    status: vi.fn(() => ({ json: statusJsonFn })),
    json: jsonFn,
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return request error if there is no body", () => {
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should return request error if there is no description", () => {
    req.body = {};
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should return request error if there is no title", () => {
    req.body = {};
    req.body.description = "description";
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should return a message", async () => {
    req.body = {};
    req.body.description = "description";
    req.body.title = "title";
    await addTodo(req, res);
    expect(jsonFn).toHaveBeenCalledWith({ message: "addTodo" });
  });
});
```

Our test is now inserting data into the database. This is not ideal for unit tests, as they should be isolated and fast. We will cover this in the next section.

## Mocking Modules

https://vitest.dev/api/vi.html#vi-mock

```ts
import { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addTodo } from "./addTodo";
import { db } from "@server/utils";
import { TodoModel } from "@server/models/todos";

vi.mock("@server/models/todos");
db.connect = vi.fn();

vi.mock("@server/models/todos");
TodoModel.insertMany = vi.fn().mockReturnValue({ success: true });

describe("addTodo", () => {
  const req = { path: "/addTodo" } as Request;
  const statusJsonFn = vi.fn();
  const jsonFn = vi.fn();
  const res = {
    status: vi.fn(() => ({ json: statusJsonFn })),
    json: jsonFn,
  } as unknown as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return request error if there is no body", () => {
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should return request error if there is no description", () => {
    req.body = {};
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should return request error if there is no title", () => {
    req.body = {};
    req.body.description = "description";
    addTodo(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(statusJsonFn).toHaveBeenCalledTimes(1);
  });

  it("should connect to the database", async () => {
    req.body = {};
    req.body.description = "description";
    req.body.title = "title";
    await addTodo(req, res);
    expect(db.connect).toHaveBeenCalledTimes(1);
    expect(jsonFn).toHaveBeenCalledWith({ message: "addTodo" });
  });

  it("should insert a new todo", async () => {
    req.body = {};
    req.body.description = "description";
    req.body.title = "title";
    await addTodo(req, res);
    expect(TodoModel.insertMany).toHaveBeenCalledTimes(1);
    expect(jsonFn).toHaveBeenCalledWith({ message: "addTodo" });
  });
});
```

## Expect Helper Functions

https://vitest.dev/api/expect.html

The most common `expect` functions are:

- `toBe` - compare values
- `toEqual` - compare objects
- `toBeGreaterThan` - compare numbers
- `toContain` - check if an array contains a value
- `toHaveBeenCalledWith` - check if a function was called with specific arguments
- `toHaveBeenCalledTimes` - check how often a function was called

## Exercise Unit Testing 1

Task: Validate a Function

Write a function `calculateTotal(items: { price: number, quantity: number }[]) : number` that calculates the total price of a list of items.

Write unit tests using Vitest to cover the following cases:

- An empty list
- A list with one item
- A list with multiple items
- Invalid or edge cases (e.g., price = -1)

## Exercise Unit Testing 2

Increase Test Coverage to >= 90%

## Vitest Client Setup

React Testing Library

React Testing Library is a popular testing library for React applications. It is designed to test components in a way that is similar to how users interact with them.

- https://testing-library.com/docs/dom-testing-library/intro
- https://testing-library.com/docs/react-testing-library/intro

- install libraries
- create a test file
- run tests

```sh
npx vitest init browser # reac and follow instructions !
```

```json
  "compilerOptions": {
    "types": ["@vitest/browser/providers/playwright"]
  }
```

To get the `vitest-example` code running, you need to move it to the `src` folder.

## Sample Code

```tsx
type ButtonProps = {
  text: string;
  color?: string;
};

export function Button({ text }: ButtonProps) {
  return <button>{text}</button>;
}
```

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("should render a button", () => {
    const result = render(<Button text="click me" />);
    expect(result).toBeDefined();
  });

  it("should render a button and match snapshot", () => {
    const result = render(<Button text="click me" />);
    expect(result.container).toMatchSnapshot();
  });
});
```

## User interactions

https://vitest.dev/guide/browser/interactivity-api.html

## Sample Code

```tsx
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  let onClick: () => void;
  let button: HTMLElement;

  beforeAll(() => {
    onClick = vi.fn();
    const renderResult = render(<Button text="click me" onClick={onClick} />);
    button = renderResult.getByTestId("my-button-component");
  });

  it("should render a button", () => {
    expect(button).toBeDefined();
  });

  it("should render a button and match snapshot", () => {
    expect(button).toMatchSnapshot();
  });

  it("should call onClick when button is clicked", () => {
    button.click();
    expect(onClick).toHaveBeenCalledWith({ data: "some data" });
  });
});
```
