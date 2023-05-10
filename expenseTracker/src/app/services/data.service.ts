import { Injectable } from '@angular/core';

import { Category } from '../models/category';
import { Expense } from '../models/expense';
import { Space } from '../models/space';


const debug = false;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  spaces: Space[] = [];
  expenses: Expense[] = [];
  categories: Category[] = [];

  constructor() { 
    if (debug) {
      const space = {
        space_id: 'b62e1928-4191-49c6-bd71-b39c382c3ee9',
        space_name: 'Debug space',
        space_description: 'Debug description',
        space_admin: 'Alex',
        space_collaborators: ['Alex', 'Lisa'],
      } as Space;
      const expense = {
        expense_id: '1',
        expense_cost: 1.0,
        expense_description: 'Debug expense',
        expense_date: '11/05/2023',
        expense_space: '1',
        expense_paid_by: 'Alex',
        expense_category: 'null',
      } as Expense;
      const category = {
        category_id: '1',
        category_title: 'Debug category',
        space_id: '1',
      } as Category;

      this.spaces = [space, space];
      this.expenses = [expense, expense];
      this.categories = [category];
    }
  }

  findSpaceById(spaceId: string): Space | undefined {
    if (debug) {
      return this.spaces[0];
    }

    return this.spaces.find(({ space_id }) => space_id === spaceId);
  }

  removeSpaceById(spaceId: string) {
    this.spaces = this.spaces.filter(space => space.space_id != spaceId);
    return this.spaces;
  }

  findExpenseById(expenseId: string): Expense | undefined {
    if (debug) {
      return this.expenses[0];
    }

    return this.expenses.find(({ expense_id }) => expense_id === expenseId);
  }

  removeExpenseById(expenseId: string) {
    this.expenses = this.expenses.filter(expense => expense.expense_id != expenseId);
    return this.expenses;
  }

  clearExpenses() {
    if (!debug) {
      this.expenses.splice(0);
    }
  }

  findCategoryById(categoryId: string): Category | undefined {
    return this.categories.find(( {category_id }) => category_id == categoryId);
  }
}
