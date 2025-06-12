import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryRs } from '../../DTOs/Response/category-rs.interface';
import { CategoryService } from '../../../services/category-service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule
  ],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() viewMode: 'list' | 'calendar' = 'list';
  @Output() viewModeChange = new EventEmitter<'list' | 'calendar'>();

  @Input() filterStatus: string = 'all';
  @Output() filterStatusChange = new EventEmitter<string>();

  @Input() categories: CategoryRs[] = [];
  @Input() filterCategory: string = 'all';
  @Output() filterCategoryChange = new EventEmitter<string>();

  @Input() filterPriority: string = 'all';
  @Output() filterPriorityChange = new EventEmitter<string>();

  @Output() categoryCreated = new EventEmitter<void>();

  showAddCategory = false;
  newCategoryName = '';

  onChangeViewMode(mode: 'list' | 'calendar') {
    this.viewModeChange.emit(mode);
  }

  onChangeFilterStatus(status: string) {
    this.filterStatusChange.emit(status);
  }

  onChangeFilterCategory(category: string) {
    this.filterCategoryChange.emit(category);
  }

  onChangeFilterPriority(priority: string) {
    this.filterPriorityChange.emit(priority);
  }

  constructor(private router: Router, private categoryService: CategoryService) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;
    this.categoryService.createCategory({ categoryName: name }).subscribe({
      next: () => {
        this.showAddCategory = false;
        this.newCategoryName = '';
        this.categoryCreated.emit();
      },
      error: err => alert('Error creando categoría')
    });
  }

  cancelAddCategory() {
    this.showAddCategory = false;
    this.newCategoryName = '';
  }
}

