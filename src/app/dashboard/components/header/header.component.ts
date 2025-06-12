import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Search, Plus, Bell, Settings } from 'lucide';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {
  @Input() searchQuery: string = '';
  @Output() searchChange = new EventEmitter<string>();
  @Output() createTask = new EventEmitter<void>();
  selectedDate: any;
  user: any;
  userTasks: any;

  constructor( private dialog: MatDialog) {}

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchChange.emit(input.value);
  }

  onCreateTask() {
    this.createTask.emit();
  }
}
