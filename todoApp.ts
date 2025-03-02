import * as readline from 'readline';

// Define the TodoItem interface
interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
  dueDate: Date;
}

/**
 * TodoList class for managing todo items
 */
class TodoList {
  private todos: TodoItem[] = [];
  private nextId: number = 1;

  /**
   * Adds a new todo item to the list
   * @param task The task description
   * @param dueDate Optional due date for the task
   * @returns The newly created todo item
   */
  addTodo(task: string, dueDate: Date = new Date()): TodoItem {
    if (!task || task.trim() === '') {
      throw new Error('Task description cannot be empty');
    }

    const newTodo: TodoItem = {
      id: this.nextId++,
      task: task.trim(),
      completed: false,
      dueDate
    };

    this.todos.push(newTodo);
    return newTodo;
  }

  /**
   * Marks a todo item as completed
   * @param id The id of the todo item to complete
   * @throws Error if todo with given id is not found
   */
  completeTodo(id: number): void {
    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    this.todos[todoIndex].completed = true;
  }

  /**
   * Removes a todo item from the list
   * @param id The id of the todo item to remove
   * @throws Error if todo with given id is not found
   */
  removeTodo(id: number): void {
    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    this.todos.splice(todoIndex, 1);
  }

  /**
   * Returns all todo items
   * @returns Array of all todo items
   */
  listTodos(): TodoItem[] {
    return [...this.todos]; // Return a copy to prevent direct modification
  }

  /**
   * Filters todos by their completed status
   * @param completed Whether to filter for completed or incomplete todos
   * @returns Filtered array of todo items
   */
  filterByStatus(completed: boolean): TodoItem[] {
    return this.todos.filter(todo => todo.completed === completed);
  }

  /**
   * Updates the task description of a todo item
   * @param id The id of the todo item to update
   * @param newTask The new task description
   * @throws Error if todo with given id is not found or if new task is empty
   */
  updateTaskDescription(id: number, newTask: string): void {
    if (!newTask || newTask.trim() === '') {
      throw new Error('Task description cannot be empty');
    }

    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    this.todos[todoIndex].task = newTask.trim();
  }

  /**
   * Updates the due date of a todo item
   * @param id The id of the todo item to update
   * @param newDueDate The new due date
   * @throws Error if todo with given id is not found
   */
  updateDueDate(id: number, newDueDate: Date): void {
    const todoIndex = this.findTodoIndexById(id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    this.todos[todoIndex].dueDate = newDueDate;
  }

  /**
   * Removes all completed todos from the list
   * @returns Number of todos removed
   */
  clearCompletedTodos(): number {
    const initialCount = this.todos.length;
    this.todos = this.todos.filter(todo => !todo.completed);
    return initialCount - this.todos.length;
  }

  /**
   * Helper method to find the index of a todo by its id
   * @param id The id to search for
   * @returns The index of the todo or -1 if not found
   */
  private findTodoIndexById(id: number): number {
    return this.todos.findIndex(todo => todo.id === id);
  }
}

/**
 * Class to handle the interactive command-line interface
 */
class TodoApp {
  private todoList: TodoList;
  private rl: readline.Interface;

  constructor() {
    this.todoList = new TodoList();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Start the interactive application
   */
  start(): void {
    console.log("\n===== Todo List Application =====\n");
    this.showMainMenu();
  }

  /**
   * Display the main menu and handle user input
   */
  private showMainMenu(): void {
    console.log("\nMAIN MENU:");
    console.log("1. Add a new todo");
    console.log("2. List all todos");
    console.log("3. List incomplete todos");
    console.log("4. List completed todos");
    console.log("5. Mark a todo as completed");
    console.log("6. Update a todo");
    console.log("7. Remove a todo");
    console.log("8. Clear all completed todos");
    console.log("0. Exit application");

    this.rl.question("\nEnter your choice (0-8): ", (choice) => {
      switch (choice) {
        case "1":
          this.addTodoFlow();
          break;
        case "2":
          this.listAllTodos();
          break;
        case "3":
          this.listIncompleteTodos();
          break;
        case "4":
          this.listCompletedTodos();
          break;
        case "5":
          this.completeTodoFlow();
          break;
        case "6":
          this.updateTodoFlow();
          break;
        case "7":
          this.removeTodoFlow();
          break;
        case "8":
          this.clearCompletedTodos();
          break;
        case "0":
          this.exitApp();
          break;
        default:
          console.log("\nInvalid choice. Please try again.");
          this.showMainMenu();
      }
    });
  }

  /**
   * Flow for adding a new todo
   */
  private addTodoFlow(): void {
    this.rl.question("\nEnter task description: ", (task) => {
      this.rl.question("Enter due date (YYYY-MM-DD) or press Enter for today: ", (dueDateStr) => {
        try {
          let dueDate: Date;
          if (dueDateStr.trim() === '') {
            dueDate = new Date();
          } else {
            dueDate = new Date(dueDateStr);
            if (isNaN(dueDate.getTime())) {
              throw new Error("Invalid date format");
            }
          }

          const newTodo = this.todoList.addTodo(task, dueDate);
          console.log(`\nAdded new todo: ${newTodo.task} (Due: ${this.formatDate(newTodo.dueDate)})`);
        } catch (error) {
          console.log(`\nError: ${this.getErrorMessage(error)}`);
        }
        this.showMainMenu();
      });
    });
  }

  /**
   * Display all todos
   */
  private listAllTodos(): void {
    const todos = this.todoList.listTodos();
    this.displayTodos(todos, "ALL TODOS");
    this.showMainMenu();
  }

  /**
   * Display incomplete todos
   */
  private listIncompleteTodos(): void {
    const todos = this.todoList.filterByStatus(false);
    this.displayTodos(todos, "INCOMPLETE TODOS");
    this.showMainMenu();
  }

  /**
   * Display completed todos
   */
  private listCompletedTodos(): void {
    const todos = this.todoList.filterByStatus(true);
    this.displayTodos(todos, "COMPLETED TODOS");
    this.showMainMenu();
  }

  /**
   * Flow for marking a todo as completed
   */
  private completeTodoFlow(): void {
    const todos = this.todoList.filterByStatus(false);
    if (todos.length === 0) {
      console.log("\nNo incomplete todos to complete.");
      this.showMainMenu();
      return;
    }

    this.displayTodos(todos, "INCOMPLETE TODOS");
    this.rl.question("\nEnter the ID of the todo to mark as completed: ", (idStr) => {
      try {
        const id = parseInt(idStr);
        this.todoList.completeTodo(id);
        console.log(`\nTodo ${id} marked as completed.`);
      } catch (error) {
        console.log(`\nError: ${this.getErrorMessage(error)}`);
      }
      this.showMainMenu();
    });
  }

  /**
   * Flow for updating a todo
   */
  private updateTodoFlow(): void {
    const todos = this.todoList.listTodos();
    if (todos.length === 0) {
      console.log("\nNo todos to update.");
      this.showMainMenu();
      return;
    }

    this.displayTodos(todos, "ALL TODOS");
    this.rl.question("\nEnter the ID of the todo to update: ", (idStr) => {
      try {
        const id = parseInt(idStr);
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
          throw new Error(`Todo with id ${id} not found`);
        }

        console.log("\nWhat would you like to update?");
        console.log("1. Task description");
        console.log("2. Due date");
        console.log("0. Cancel");

        this.rl.question("\nEnter your choice (0-2): ", (choice) => {
          switch (choice) {
            case "1":
              this.updateTaskDescription(id);
              break;
            case "2":
              this.updateDueDate(id);
              break;
            case "0":
            default:
              this.showMainMenu();
          }
        });
      } catch (error) {
        console.log(`\nError: ${this.getErrorMessage(error)}`);
        this.showMainMenu();
      }
    });
  }

  /**
   * Update a todo's task description
   */
  private updateTaskDescription(id: number): void {
    this.rl.question("\nEnter new task description: ", (newTask) => {
      try {
        this.todoList.updateTaskDescription(id, newTask);
        console.log(`\nTodo ${id} description updated successfully.`);
      } catch (error) {
        console.log(`\nError: ${this.getErrorMessage(error)}`);
      }
      this.showMainMenu();
    });
  }

  /**
   * Update a todo's due date
   */
  private updateDueDate(id: number): void {
    this.rl.question("\nEnter new due date (YYYY-MM-DD): ", (dueDateStr) => {
      try {
        const dueDate = new Date(dueDateStr);
        if (isNaN(dueDate.getTime())) {
          throw new Error("Invalid date format");
        }
        this.todoList.updateDueDate(id, dueDate);
        console.log(`\nTodo ${id} due date updated successfully.`);
      } catch (error) {
        console.log(`\nError: ${this.getErrorMessage(error)}`);
      }
      this.showMainMenu();
    });
  }

  /**
   * Flow for removing a todo
   */
  private removeTodoFlow(): void {
    const todos = this.todoList.listTodos();
    if (todos.length === 0) {
      console.log("\nNo todos to remove.");
      this.showMainMenu();
      return;
    }

    this.displayTodos(todos, "ALL TODOS");
    this.rl.question("\nEnter the ID of the todo to remove: ", (idStr) => {
      try {
        const id = parseInt(idStr);
        this.todoList.removeTodo(id);
        console.log(`\nTodo ${id} removed successfully.`);
      } catch (error) {
        console.log(`\nError: ${this.getErrorMessage(error)}`);
      }
      this.showMainMenu();
    });
  }

  /**
   * Clear all completed todos
   */
  private clearCompletedTodos(): void {
    const removedCount = this.todoList.clearCompletedTodos();
    console.log(`\nRemoved ${removedCount} completed todos.`);
    this.showMainMenu();
  }

  /**
   * Exit the application
   */
  private exitApp(): void {
    console.log("\nThank you for using Todo List Application. Goodbye!");
    this.rl.close();
  }

  /**
   * Helper method to display todos in a formatted table
   */
  private displayTodos(todos: TodoItem[], title: string): void {
    console.log(`\n===== ${title} =====`);
    
    if (todos.length === 0) {
      console.log("No todos found.");
      return;
    }

    console.log("\nID | Status | Due Date | Task");
    console.log("---|--------|----------|-------");
    
    todos.forEach(todo => {
      const status = todo.completed ? "✓" : "☐";
      const formattedDate = this.formatDate(todo.dueDate);
      // console.log(`${todo.id.toString().padEnd(2)} | ${status}      | ${formattedDate} | ${todo.task}`);
      console.log(`${todo.id.toString().padEnd(3)} | ${status}      | ${formattedDate} | ${todo.task}`);
    });
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Safe error message extraction
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}

// Start the application
const app = new TodoApp();
app.start();