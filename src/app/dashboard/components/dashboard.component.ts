import { Component, inject, Inject, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CalendarComponent } from './calendar/calendar.component';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule } from '@angular/forms';
import { UserEntity } from '../Entities/user-entity.interface';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FilterRq } from '../DTOs/Request/filter-rq.interface';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../Entities/task-entity.interface';
import { TaskRq } from '../DTOs/Request/task-rq.interface';
import { ConfirmDialogComponent } from './ui/confirm-dialog';
import { CategoryRs } from '../DTOs/Response/category-rs.interface';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalendarComponent,
    TaskListComponent,
    FormsModule,
    SidebarComponent,
    CommonModule,
    HeaderComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  protected categoryService = inject(CategoryService)
  selectedDate: string = new Date().toISOString().split('T')[0];
  user: UserEntity | undefined;
  userTasks: Task[] = [];
  searchQuery: string = '';
  viewMode: 'list' | 'calendar' = 'list'; 
  showCreateModal: boolean = false;
  filterStatus: string = 'all';
  filterCategory: string = 'all';
  filterPriority: string = 'all';
  categories: CategoryRs[] = [];

  constructor(private authService: AuthService, private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.categoryService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Error loading categories:', err)
    });
    if (this.user) {
      if (this.viewMode === 'calendar') {
        this.loadAllTasks();
      } else {
        this.loadTasksForDate();
      }
    }
  }

  onViewModeChange(mode: 'list' | 'calendar') {
    this.viewMode = mode;
    if (mode === 'calendar') {
      this.loadAllTasks();
    } else {
      this.loadTasksForDate();
    }
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }

  loadAllTasks(): void {
    if (!this.user) return;
    this.taskService.getTasks(this.user.userId).subscribe({
      next: (tasks) => this.userTasks = tasks,
      error: (err) => console.error('Error loading all tasks:', err)
    });
  }

  onFilterStatusChange(status: string) {
    this.filterStatus = status;
  }

  onFilterCategoryChange(category: string) {
    this.filterCategory = category;
  }

  onFilterPriorityChange(priority: string) {
    this.filterPriority = priority;
  }

  loadTasksForDate(): void {
    if (!this.user) return;

    const rq: FilterRq = {
      startDate: this.selectedDate,
      endDate: null,
      priority: null,
      status: null,
      category: null
    };

    this.taskService.getTasksByDate(this.user.userId, rq).subscribe({
      next: (tasks) => this.userTasks = tasks,
      error: (err) => console.error('Error loading tasks for date:', err)
    });
    console.log(this.userTasks);

  }


  onCreateTask() {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: {categories: this.categories}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.user) {
        const rq: TaskRq = {
          userId: this.user.userId,
          title: result.title,
          description: result.description,
          startEventDate: result.startEventDate,
          endEventDate: result.endEventDate,
          priority: result.priority,
          status: result.status,
          category: result.category,
        };
        console.log(rq)
        console.log(this.user);
        this.taskService.createTask(rq).subscribe({
          next: () =>{
            if (this.viewMode === 'calendar') {
            this.loadAllTasks();
          } else {
            this.loadTasksForDate();
          }
          },
          error: err => console.error('Error creating task:', err)
        });
      }
      this.loadTasksForDate();
    });
  }

  onDateChange(newDate: string) {
    this.selectedDate = newDate;
    this.loadTasksForDate(); 
  }

  onResetToToday() {
    this.selectedDate = this.formatDate(new Date());
    this.loadTasksForDate();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  get filteredTasks(): Task[] {
    let tasks = this.userTasks;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      tasks = tasks.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    if (this.filterStatus !== 'all') {
      const statusMap: Record<string, number> = { pending: 2, 'in-progress': 3, completed: 1 };
      tasks = tasks.filter(t => t.status === statusMap[this.filterStatus]);
    }

    if (this.filterCategory !== 'all') {
      tasks = tasks.filter(t => t.category === +this.filterCategory);
    }

    if (this.filterPriority !== 'all') {
      const priorityMap: Record<string, number> = { high: 1, medium: 2, low: 3 };
      tasks = tasks.filter(t => t.priority === priorityMap[this.filterPriority]);
    }

    return tasks;
  }

  reloadCategories() {
    this.categoryService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Error loading categories:', err)
    });
  }

  onEditTask(task: Task) {
    console.log('Editing task:', task);
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '400px',
      data: { categories: this.categories,task }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) {
        const updatedTask: TaskRq = {
          userId: this.user?.userId || null,
          title: result.title,
          description: result.description,
          startEventDate: result.startEventDate, 
          endEventDate: result.endEventDate,     
          priority: result.priority,
          status: result.status,
          category: result.category,
          createdAt: task.createdAt ? new Date(task.createdAt).toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
        this.taskService.updateTask(task.id, updatedTask).subscribe({
          next: () => {
            if (this.viewMode === 'calendar') {
              this.loadAllTasks();
            } else {
              this.loadTasksForDate();
            }
          },
          error: err => console.error('Error updating task:', err)
        });
      }
    });
  }

  deleteTask(task: Task) {
    if (!task.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: `¿Seguro que quieres eliminar la tarea "${task.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => this.loadTasksForDate(),
          error: err => console.error('Error deleting task:', err),
        });
      }
    });
  }
}
