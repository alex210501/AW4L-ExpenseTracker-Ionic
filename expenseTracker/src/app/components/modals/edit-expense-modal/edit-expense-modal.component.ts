import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { Expense } from 'src/app/models/expense';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-edit-expense-modal',
  templateUrl: './edit-expense-modal.component.html',
  styleUrls: ['./edit-expense-modal.component.scss'],
})

/**
 * Modal to edit or create an expense
 */
export class EditExpenseModalComponent implements OnInit {
  validationForm!: FormGroup;
  isNewExpense = false;
  spaceId = '';
  expenseId = '';
  expenseDescription = '';
  expenseCost = 0.0;
  category: Category | null = null;
  categoriesSelect: (Category | null)[] = [];

  /**
   * Constructor
   * @param alertService Service to create an alert
   * @param formBuilder Builder to create a form
   * @param modalController Modal controller
   * @param apiService Service to access the API
   * @param dataService Access the shared data
   */
  constructor(
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private apiService: ApiService,
    public dataService: DataService,
  ) { }

  /**
   * Validator for the cost
   * @param control Form control to access the form fields
   * @returns null
   */
  _checkCost(control: FormControl) {
    let cost: number = Number.parseFloat(control.get('cost')?.value);

    if (Number.isNaN(cost)) {
      control.get("cost")?.setErrors({ mismatch: true });
    }

    return null;
  }

  /**
   * Initialize components
   */
  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      description: new FormControl('', Validators.required),
      cost: new FormControl(0.0, Validators.required),
    }, { validators: this._checkCost });

    // If an expenseId has been passed, retrieve its arguments
    if (this.expenseId != null) {
      this.isNewExpense = false;
      const expense = this.dataService.findExpenseById(this.expenseId);

      // Load arguments
      this.expenseDescription = expense?.expense_description ?? '';
      this.expenseCost = expense?.expense_cost ?? 0.0;
      this.categoriesSelect = [null, ...this.dataService.categories];
      this.category = this.dataService.findCategoryById(expense?.expense_category ?? '');
    } else {
      this.isNewExpense = true;
    }
  }

  /**
   * Callback to edit the expense
   */
  onEdit() {
    if (this.validationForm.valid) {
      if (this.isNewExpense) {
        this.apiService.createExpense(this.spaceId, this.expenseDescription, this.expenseCost,
          (err) => this.alertService.apiErrorAlert(err))
          .subscribe(result => this.modalController.dismiss(result as Expense, 'valid'));
      } else {
        const expense = this.dataService.findExpenseById(this.expenseId);

        // Update parameters
        expense!.expense_description = this.expenseDescription;
        expense!.expense_cost = this.expenseCost;
        expense!.expense_category = this.category?.category_id ?? null;

        this.modalController.dismiss(expense, 'valid')
      }
    }
  }

  /**
   * Callback to cancel the modification
   * @returns Result of the modal controller
   */
  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
