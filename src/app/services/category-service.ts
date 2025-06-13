import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryRs } from '../dashboard/DTOs/Response/category-rs.interface';
import { CategoryRq } from '../dashboard/DTOs/Request/category-rq.interface';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7239/api/Categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryRs[]> {
    return this.http.get<CategoryRs[]>(this.apiUrl);
  }

  createCategory(category: CategoryRq) {
    return this.http.post(this.apiUrl, category);
}
}