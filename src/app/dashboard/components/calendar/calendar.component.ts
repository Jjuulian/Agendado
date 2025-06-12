import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../Entities/task-entity.interface'; 
import { ButtonComponent } from '../ui/button.component'
import { LucideAngularModule, User } from 'lucide-angular'; 
import { UserEntity } from '../../Entities/user-entity.interface';
import {MatIconModule} from '@angular/material/icon';
import { CategoryRs } from '../../DTOs/Response/category-rs.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule,LucideAngularModule, MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() categories: CategoryRs[] = [];
  @Output() editTask = new EventEmitter<Task>();
  @Output() createTask = new EventEmitter<void>();
  @Input() user: UserEntity | undefined;
  @Output() dateSelected = new EventEmitter<string>();

  currentDate = new Date();
  today = new Date();

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    console.log('Calendar initialized with tasks:', this.tasks);
  }

  get daysInMonth(): number {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
  }

  get firstDayOfMonth(): number {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
  }

  navigateMonth(direction: 'prev' | 'next') {
    const newDate = new Date(this.currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    this.currentDate = newDate;
  }

  getTasksForDate(date: Date): Task[] {
    return this.tasks.filter(task => new Date(task.endEventDate).toDateString() === date.toDateString());
  }

  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  isPast(date: Date): boolean {
    return date < this.today && !this.isToday(date);
  }

  onTaskClick(task: Task) {
    this.editTask.emit(task);
  }

  onCreate() {
    this.createTask.emit();
  }

  getDateForIndex(i: number): Date {
    return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i + 1);
  }

  onDayClick(date: Date) {
    const isoDate = date.toISOString().split('T')[0];
    this.dateSelected.emit(isoDate);
  }

  getCategoryLabel(task: Task): string {
    const found = this.categories.find(c => c.id === task.category);
    return found ? found.categoryName : 'Sin categoría';
  }
}
