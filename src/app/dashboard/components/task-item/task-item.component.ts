import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../Entities/task-entity.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CategoryRs } from '../../DTOs/Response/category-rs.interface';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() categories: CategoryRs[] = [];
  @Output() toggleStatus = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();

  today = new Date();

  isOverdue(): boolean {
    return (
      this.task.endEventDate &&
      new Date(this.task.endEventDate) < this.today &&
      this.task.status !== 1
    );
  }

  isToday(): boolean {
    if (!this.task.endEventDate) return false;
    const d = new Date(this.task.endEventDate);
    return d.toDateString() === this.today.toDateString();
  }
  isCurrentYear(date: string | Date | null | undefined): boolean {
    if (!date) return false;
    const d = new Date(date);
    return d.getFullYear() === this.today.getFullYear();
  }

  getCategoryLabel(): string {
    const found = this.categories.find(c => c.id === this.task.category);
    return found ? found.categoryName : 'Sin categoría';
  }

  getStatusLabel(): string {
    switch (this.task.status) {
      case 1: return 'Completada';
      case 2: return 'Pendiente';
      case 3: return 'En progreso';
      default: return 'Desconocido';
    }
  }

  getPriorityLabel(): string {
    switch (this.task.priority) {
      case 1: return 'Alta';
      case 2: return 'Media';
      case 3: return 'Baja';
      default: return 'Sin prioridad';
    }
  }

  priorityBadgeClass() {
    switch (this.task.priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  statusBadgeClass() {
    switch (this.task.status) {
      case 0: return 'bg-gray-100 text-gray-800 border-gray-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  categoryBadgeClass() {
    switch (this.task.category) {
      case 1: return 'bg-purple-100 text-purple-800 border-purple-200';
      case 2: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 3: return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}