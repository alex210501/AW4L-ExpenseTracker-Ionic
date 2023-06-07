import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { EditExpenseModalComponent } from '../modals/edit-expense-modal/edit-expense-modal.component';
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
  category: Category | null = null;
  categoriesSelect: (Category | null)[] = [];
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private modalController: ModalController,
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
    this.categoriesSelect = [null, ...this.dataService.categories];
    this.category = this.dataService.findCategoryById(this.expense?.expense_category ?? '');
  }

  async onEdit() {
    const modal = await this.modalController.create({
      component: EditExpenseModalComponent,
      componentProps: { spaceId: this.spaceId, expenseId: this.expense?.expense_id },
    });

    // Open
    modal.present();

    /// Get new expense
    const { data, role } = await modal.onWillDismiss();

    if (role === 'valid' && data) {
      this.apiService.patchExpense(this.spaceId, data)
        .subscribe((_) => {
          this.dataService.editExpense(data);
          this.expense = data;
        });
    }
  }

  onDelete() {
    if (this.expense) {
      this.apiService.deleteExpense(this.spaceId, this.expense.expense_id)
        .subscribe(_ => this.router.navigate([`space/${this.spaceId}`]));
    }
  }

  goBack() {
    this.location.back();
  }

  _loadCategory() {
    // if (this.expense && this.expense.expense_category) {
    //   this.category = this.dataService.findCategoryById(this.expense.expense_category);
    // }
  }

  // onCategoryChange(ev) {
  //   console.log(ev.target.value);
  // }
}