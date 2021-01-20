import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUrl = 'assets/json/products.json';

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    console.log(error)
  }

  getProductList(): Observable<JSON[]> {
    return this.http.get<JSON[]>(this.productUrl).pipe(catchError(this.handleError.bind(this)))
  }
}
