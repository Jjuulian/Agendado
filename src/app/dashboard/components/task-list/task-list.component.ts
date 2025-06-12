import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../Entities/task-entity.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { UserEntity } from '../../Entities/user-entity.interface';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../../services/task.service';
import { FilterRq } from '../../DTOs/Request/filter-rq.interface';
import { CategoryRs } from '../../DTOs/Response/category-rs.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIcon, TaskItemComponent],
  providers: [TaskService]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Input() date!: string;
  @Input() user: UserEntity | undefined;
  @Input() categories: CategoryRs[] = [];

  @Output() dateChange = new EventEmitter<string>();
  @Output() resetToToday = new EventEmitter<void>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTaskEvent = new EventEmitter<Task>();

  navigateDay(direction: 'prev' | 'next'): void {
    const current = new Date(this.date);
    if (direction === 'prev') current.setDate(current.getDate() - 1);
    else current.setDate(current.getDate() + 1);

    const newDate = current.toISOString().split('T')[0];
    this.dateChange.emit(newDate);
  }

  get sortedTasks(): Task[] {
    return [...this.tasks].sort((a, b) => {
      const order = { 2: 0, 3: 1, 1: 2 };
      return order[a.status as keyof typeof order] - order[b.status as keyof typeof order];
    });
  }

  getCategoryLabel(task: Task): string {
    const found = this.categories.find(c => c.id === task.category);
    return found ? found.categoryName : 'Sin categoría';
  }

  getToday(): void {
    this.resetToToday.emit();
  }

  onToggleStatus(task: Task): void {
    this.editTask.emit(task);
  }

  deleteTaskEventHandler(task: Task): void {
    this.deleteTaskEvent.emit(task);
  }

  onEditTask(task: Task): void {
    this.editTask.emit(task);
  }
}