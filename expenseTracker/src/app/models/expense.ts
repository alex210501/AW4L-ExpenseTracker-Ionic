import { Category } from "./category";

export class Expense {
  expense_id = '';
  expense_cost = 0.0;
  expense_description = '';
  expense_date = '';
  expense_space = '';
  expense_paid_by = '';
  expense_category: string | null = null;

  constructor(expense: Expense) {
    return {
      expense_id: `${expense.expense_id}`,
      expense_cost: expense.expense_cost,
      expense_description: `${expense.expense_description}`,
      expense_date: `${expense.expense_date}`,
      expense_space: `${expense.expense_space}`,
      expense_paid_by: `${expense.expense_paid_by}`,
      expense_category: `${expense.expense_category}`,
    } as Expense;
  }
}
