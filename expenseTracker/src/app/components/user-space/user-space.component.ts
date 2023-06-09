import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { Category } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service';
import { EditExpenseModalComponent } from '../modals/edit-expense-modal/edit-expense-modal.component';
import { ShowQrcodeModalComponent } from '../modals/show-qrcode-modal/show-qrcode-modal.component';
import { Space } from 'src/app/models/space';
import { Expense } from 'src/app/models/expense';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.scss']
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
    private alertService: AlertService,
    private route: ActivatedRoute, 
    private location: Location,
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService, 
    public dataService: DataService,
    ) {}

  getTotalExpenses(username: string | null = null): number {
    return this.dataService.expenses.reduce((acc, expense) => {
      if (username == null || username == expense.expense_paid_by) {
        return acc + expense.expense_cost;
      }

      return acc;
    }, 0);
  }

  getTotalExpensesUser = () => this.getTotalExpenses(this.dataService.username);

  onRefresh(event: any) {
    this.apiService.getExpensesFromSpaceId(this.spaceId, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(expenses => {
        this.dataService.expenses = expenses;
        event.target.complete();
      });
  }

  ngOnInit() {
    // Get space ID from path
    this.spaceId = this.route.snapshot.paramMap.get('space_id') ?? '';

    // Clear the expenses array from dataService
    this.dataService.clearExpenses();

    // Get new expenses from API
    this.apiService.getExpensesFromSpaceId(this.spaceId, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(expenses => this.dataService.expenses = expenses);

    // Get category from API
    this.apiService.getCategoriesFromSpace(this.spaceId, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(categories => this.dataService.categories = categories);

    // Get space from its ID
    this.space = this.dataService.findSpaceById(this.spaceId);
  }

  onExpense(expenseId: string) {
    this.expense = this.dataService.findExpenseById(expenseId) as Expense;
    
    if (this.expense) {
      // this.category = this.dataService.findCategoryById(this.expense.expense_category ?? '');
      this.expenseToEdit = new Expense(this.expense);
      this.router.navigate([`space/${this.spaceId}/expense/${this.expense.expense_id}`])
    }
  }

  async openCreateExpenseDialog() {
    const modal = await this.modalController.create({
      component: EditExpenseModalComponent,
      componentProps: { spaceId: this.spaceId, expenseId: null },
    });

    // Open
    modal.present();

    /// Get new expense
    const { data, role } = await modal.onWillDismiss();

    if (role === 'valid' && data) {
      this.dataService.expenses.unshift(data);
    }
  }

  goBack() {
    this.location.back();
  }

  onEdit() {
    this.editMode = !this.editMode;
  }

  onDelete(spaceId: string) {
    this.apiService.deleteExpense(this.spaceId, spaceId, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(_ => {
        this.router.navigate([`space/${this.spaceId}`]);
        this.dataService.removeExpenseById(spaceId);
        this.expense = undefined;
      });
  }

  async showQrCode() {
    const modal = await this.modalController.create({
      component: ShowQrcodeModalComponent,
      componentProps: { qrCode: this.spaceId },
    });

    // Open
    modal.present();
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
      this.apiService.patchExpense(this.spaceId, this.expense, 
        (err) => this.alertService.apiErrorAlert(err)).subscribe();
    }
  }

  onCancel() {
    this.editMode = false;
    this.expenseToEdit = this.expense;
  }
}
