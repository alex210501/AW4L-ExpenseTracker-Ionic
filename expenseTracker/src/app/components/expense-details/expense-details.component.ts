import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { Expense } from 'src/app/models/expense';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})
export class ExpenseDetailComponent {
  spaceId = '';
  expense?: Expense;
  category?: Category;
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private apiService: ApiService,
    public dataService: DataService
  ) {}

  ngOnInit() {
    // Get space and expense ID from path
    this.spaceId = this.route.snapshot.paramMap.get('space_id') ?? '';
    const expenseId = this.route.snapshot.paramMap.get('expense_id') ?? '';

    // Get expense and category
    this.expense = this.dataService.findExpenseById(expenseId);
    this._loadCategory();
  }

  onEdit() {
    this.editMode = !this.editMode;
  }

  onDelete() {
    if (this.expense) {
      this.apiService.deleteExpense(this.spaceId, this.expense.expense_id)
        .subscribe(_ => this.router.navigate([`space/${this.spaceId}`]));
    }
  }

  onSave() {
    if (this.expense) {
      this.editMode = false;
      this.apiService.patchExpense(this.spaceId, this.expense).subscribe();
      this._loadCategory();
    }
  }

  onCancel() {
    this.editMode = false;
  }

  goBack() {
    this.location.back();
  }

  _loadCategory() {
    if (this.expense && this.expense.expense_category) {
      this.category = this.dataService.findCategoryById(this.expense.expense_category);
    }
  }
}