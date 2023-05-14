import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

import { ApiService } from 'src/app/services/api.service';
import { Category } from 'src/app/models/category';
// import { CreateExpenseDialogComponent } from '../dialogs/create-expense-dialog/create-expense-dialog.component';
import { DataService } from 'src/app/services/data.service';
import { Space } from 'src/app/models/space';
import { Expense } from 'src/app/models/expense';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.css']
})
export class UserSpaceComponent {
  spaceId = '';
  space?: Space;
  expenses: Expense[] = [];
  expense?: Expense;
  expenseToEdit?: Expense;
  category?: Category;
  editMode = false;

  constructor(
    private route: ActivatedRoute, 
    private location: Location,
    private router: Router,
    private apiService: ApiService, 
    public dataService: DataService,
    // public dialog: MatDialog
    ) {}

  ngOnInit() {
    // Get space ID from path
    this.spaceId = this.route.snapshot.paramMap.get('space_id') ?? '';

    // Clear the expenses array from dataService
    this.dataService.clearExpenses();

    // Get new expenses from API
    this.apiService.getExpensesFromSpaceId(this.spaceId)
      .subscribe(expenses => this.dataService.expenses = expenses);

    // Get category from API
    this.apiService.getCategoriesFromSpace(this.spaceId)
      .subscribe(categories => this.dataService.categories = categories);

    // Get space from its ID
    this.space = this.dataService.findSpaceById(this.spaceId);
    this._loadCategory();
  }

  onExpense(expenseId: string) {
    this.expense = this.dataService.findExpenseById(expenseId) as Expense;

    if (this.expense) {
      this.category = this.dataService.findCategoryById(this.expense.expense_category ?? '');
      this.expenseToEdit = new Expense(this.expense);
    }
  }

  openCreateExpenseDialog() {
    // const dialogRef = this.dialog.open(CreateExpenseDialogComponent, 
    //   { data: { spaceId: this.spaceId } });

    // Get expense from dialog
    // dialogRef.afterClosed().subscribe(expense => {
    //   if (expense) {
    //     this.dataService.expenses.push(expense);
    //   }
    // });
  }

  goBack() {
    this.location.back();
  }

  onEdit() {
    this.editMode = !this.editMode;
  }

  onDelete() {
    if (this.expense) {
      this.apiService.deleteExpense(this.spaceId, this.expense.expense_id)
        .subscribe(_ => {
          this.router.navigate([`space/${this.spaceId}`]);
          this.dataService.removeExpenseById(this.expense!.expense_id);
          this.expense = undefined;
        });
    }
  }

  onSave() {
    if (this.expenseToEdit) {
      if (this.expense) {
        this.expense.expense_id = this.expenseToEdit.expense_id;
        this.expense.expense_cost = this.expenseToEdit.expense_cost;
        this.expense.expense_description = this.expenseToEdit.expense_description;
        this.expense.expense_date = this.expenseToEdit.expense_date;
        this.expense.expense_space = this.expenseToEdit.expense_space;
        this.expense.expense_paid_by = this.expenseToEdit.expense_paid_by;
        this.expense.expense_category = this.expenseToEdit.expense_category;
      } else {
        this.expense = new Expense(this.expenseToEdit);
      }
      this.expense = this.expenseToEdit;
      this.editMode = false;
      this.apiService.patchExpense(this.spaceId, this.expense).subscribe();
      this._loadCategory();
    }
  }

  onCancel() {
    this.editMode = false;
    this.expenseToEdit = this.expense;
  }

  onCategoryChange() {
    this._loadCategory();
  }

  _loadCategory() {
    if (this.expense && this.expense.expense_category) {
      this.category = this.dataService.findCategoryById(this.expense.expense_category);
    }
  }
}