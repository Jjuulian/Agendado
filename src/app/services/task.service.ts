import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRs } from '../dashboard/DTOs/Response/task-rs.interface';
import { FilterRq } from '../dashboard/DTOs/Request/filter-rq.interface';
import { TaskRq } from '../dashboard/DTOs/Request/task-rq.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://localhost:7239/api/Events';

  constructor(private http: HttpClient) {}

  getTasks(userId: number): Observable<TaskRs[]> {
    return this.http.get<TaskRs[]>(`${this.apiUrl}/${userId}`);
  }

  getTasksByDate(userId: number ,rq: FilterRq): Observable<TaskRs[]> {
    return this.http.post<TaskRs[]>(`${this.apiUrl}/filter?userId=${userId}`, rq);
  }

  createTask(task: TaskRq): Observable<TaskRs> {
    return this.http.post<TaskRs>(this.apiUrl, task);
  }

  updateTask(id: number, task: TaskRq) {
    return this.http.put(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}