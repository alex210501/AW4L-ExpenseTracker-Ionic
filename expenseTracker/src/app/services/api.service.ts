import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Credentials } from '../models/credentials';
import { Collaborator } from '../models/collaborator';
import { Expense } from '../models/expense';
import { Space } from '../models/space';
import { Token } from '../models/token';
import { User } from '../models/user';
import { Category } from '../models/category';

// Option passed to the HTTP requests
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

/**
 * PATH
 */
const URL = 'https://alejandro-borbolla.com/expensestracker/api';
const LOGIN_URL = `${URL}/auth/login`;
const LOGOUT_URL = `${URL}/logout`;

// User Management
const CREATE_USER_URL = `${URL}/user`;

// Space
const SPACES_URL = `${URL}/space`;
const SPACE_ID_URL = `${URL}/space/:space_id`;

// Expense
const EXPENSE_URL = `${URL}/space/:space_id/expense`;
const EXPENSE_ID_URL = `${URL}/space/:space_id/expense/:expense_id`;

// Category
const CATEGORY_URL = `${URL}/space/:space_id/category`;
const CATEGORY_ID_URL = `${URL}/space/:space_id/category/:category_id`;

// Space User
const SPACE_USER_URL = `${URL}/space/:space_id/user`;
const SPACE_USER_ID_URL = `${URL}/space/:space_id/user/:username`;
const SPACE_JOIN_URL = `${URL}/space/:space_id/join`;
const SPACE_QUIT_URL = `${URL}/space/:space_id/quit`;

// Define the ErrorCallback type
type ErrorCallback = (error: any) => void;

@Injectable({
  providedIn: 'root'
})

/**
 * Service to access the API
 */
export class ApiService {
  private token = '';

  /**
   * Constructor
   * @param http HTTP client
   */
  constructor(private http: HttpClient) { }

  /**
   * Function to handle errors
   * @param error Error that occured
   * @param errorCallback Callback to handler an error
   */
  private handleError(error: any, errorCallback?: ErrorCallback): Observable<never> {
    if (errorCallback) {
      errorCallback(error);
    }

    console.error('An error occurred:', error);

    return of();
  }

  /**
   * Login to the API
   * @param credentials Credentials to authenticate
   * @param errorCallback Error callback
   */
  login(credentials: Credentials, errorCallback?: ErrorCallback) {
    return this.http.post<Token>(LOGIN_URL, JSON.stringify(credentials), httpOptions).pipe(
      tap(token => {
        this.token = token.token;
        httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${this.token}`);
      }),
      catchError((err) => this.handleError(err, errorCallback)),
    );
  }

  /**
   * Logout from the API
   * @param errorCallback Error callback
   */
  logout(errorCallback?: ErrorCallback) {
    return this.http.post(LOGOUT_URL, {}, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Create a new user
   * @param user User to create
   * @param errorCallback Error callback
   */
  createUser(user: User, errorCallback?: ErrorCallback) {
    return this.http.post<User>(CREATE_USER_URL, JSON.stringify(user), httpOptions).pipe(
      tap(_ => console.log('User created')),
      catchError((err) => this.handleError(err, errorCallback)),
    );
  }

  /**
   * Get spaces of a user
   */
  getSpaces(errorCallback?: ErrorCallback): Observable<Space[]> {
    return this.http.get<Space[]>(SPACES_URL, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Get a space given its space ID
   * @param spaceId ID of the space
   * @param errorCallback Error callback
   */
  getSpaceById(spaceId: string, errorCallback?: ErrorCallback): Observable<Space> {
    return this.http.get<Space>(
      SPACE_ID_URL.replace(':space_id', spaceId),
      httpOptions
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Create a new space
   * @param spaceName Name of the space
   * @param spaceDescription Description
   * @param errorCallback Error callback
   */
  createSpace(spaceName: string, spaceDescription: string,
    errorCallback?: ErrorCallback): Observable<Object> {
    const spaceJson = {
      space_name: spaceName,
      space_description: spaceDescription,
    };

    return this.http.post(SPACES_URL, spaceJson, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Edit an existing space
   * @param space Edited space
   * @param errorCallback Error callback
   */
  patchSpace(space: Space, errorCallback?: ErrorCallback): Observable<Space> {
    const spaceJson = {
      space_name: space.space_name,
      space_description: space.space_description,
    };

    console.log(spaceJson);

    return this.http.patch<Space>(
      SPACE_ID_URL.replace(':space_id', space.space_id),
      spaceJson,
      httpOptions,
    )
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Delete space given its ID
   * @param spaceId ID of the space to delete
   * @param errorCallback Error callback
   */
  deleteSpace(spaceId: string, errorCallback?: ErrorCallback) {
    return this.http.delete(
      SPACE_ID_URL.replace(':space_id', spaceId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Get all expenses from a space
   * @param spaceId ID of the space
   */
  getExpensesFromSpaceId(spaceId: string, errorCallback?: ErrorCallback): Observable<Expense[]> {
    return this.http.get<Expense[]>(EXPENSE_URL.replace(':space_id', spaceId), httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Create an expense in a space
   * @param spaceId ID of the space
   * @param expenseDescription Description
   * @param expenseCost Cost
   * @param errorCallback Error callback
   */
  createExpense(
    spaceId: string,
    expenseDescription:
      string, expenseCost: number,
    errorCallback?: ErrorCallback): Observable<Expense> {
    const expenseJson = {
      expense_description: expenseDescription,
      expense_cost: expenseCost,
    };

    return this.http.post<Expense>(
      EXPENSE_URL.replace(':space_id', spaceId),
      expenseJson,
      httpOptions).pipe(
        catchError((err) => this.handleError(err, errorCallback)),
      );
  }

  /**
   * Edit an existing expense in a space
   * @param spaceId ID of the space
   * @param expense Edited expense
   * @param errorCallback Error callback
   */
  patchExpense(spaceId: string, expense: Expense,
    errorCallback?: ErrorCallback): Observable<Map<string, string>> {
    let expenseJson = {
      expense_description: expense.expense_description,
      expense_cost: expense.expense_cost,
      expense_category: expense.expense_category ?? null,
    };
    console.log(expense.expense_category);
    return this.http.patch<Map<string, string>>(
      EXPENSE_ID_URL.replace(':space_id', spaceId).replace(':expense_id', expense.expense_id),
      expenseJson,
      httpOptions).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Delete an expense given its space and expense ID
   * @param spaceId ID of the space
   * @param expenseId ID of the expense
   * @param errorCallback Error callback
   */
  deleteExpense(spaceId: string, expenseId: string, errorCallback?: ErrorCallback): Observable<Expense> {
    return this.http.delete<Expense>(
      EXPENSE_ID_URL.replace(':space_id', spaceId).replace(':expense_id', expenseId),
      httpOptions).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Get all the categories from a space
   * @param spaceId ID of the space
   * @param errorCallback Error callback
   */
  getCategoriesFromSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Category[]> {
    return this.http.get<Category[]>(
      CATEGORY_URL.replace(':space_id', spaceId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Create a category inside a space
   * @param spaceId ID of the space
   * @param categoryTitle Title of the category
   * @param errorCallback Error callback
   */
  createCategoryToSpace(spaceId: string, categoryTitle: string, errorCallback?: ErrorCallback): Observable<Category> {
    return this.http.post<Category>(
      CATEGORY_URL.replace(':space_id', spaceId),
      { category_title: categoryTitle },
      httpOptions
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Delete a category from a space
   * @param spaceId ID of the space
   * @param categoryId ID of the category
   * @param errorCallback Error callback
   */
  deleteCategoryFromSpace(spaceId: string,
    categoryId: string,
    errorCallback?: ErrorCallback): Observable<Category> {
    return this.http.delete<Category>(
      CATEGORY_ID_URL.replace(':space_id', spaceId).replace(':category_id', categoryId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Add a user to the space
   * @param spaceId ID of the space
   * @param username Username to add
   * @param errorCallback Error callback
   */
  addUserToSpace(spaceId: string,
    username: string,
    errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_USER_URL.replace(':space_id', spaceId),
      { username },
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Delete a user from a space
   * @param spaceId ID of the space
   * @param username Username to delete
   * @param errorCallback Error callback
   */
  deleteUserFromSpace(spaceId: string, username: string, errorCallback?: ErrorCallback): Observable<Object> {
    return this.http.delete(
      SPACE_USER_ID_URL.replace(':space_id', spaceId).replace(':username', username),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Join a space by its ID
   * @param spaceId ID of the space to join
   * @param errorCallback Error callback
   */
  joinSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_JOIN_URL.replace(':space_id', spaceId),
      null,
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  /**
   * Quit a space
   * @param spaceId ID of the space
   * @param errorCallback Error callback
   * @returns 
   */
  quitSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_QUIT_URL.replace(':space_id', spaceId),
      null,
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }
}
