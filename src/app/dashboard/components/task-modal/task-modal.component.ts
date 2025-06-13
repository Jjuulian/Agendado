import { Component, inject, Inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { Task } from '../../Entities/task-entity.interface';
import { CategoryRs } from '../../DTOs/Response/category-rs.interface';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
  CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  templateUrl: './task-modal.component.html',
})
export class TaskModalComponent implements OnInit {
  form!: FormGroup;
  categories: CategoryRs[] = [];

  priorities = ['low', 'medium', 'high'];
  statuses = ['pending', 'in-progress', 'completed'];
  

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task, categories: CategoryRs[]  }
  ) {}

  ngOnInit() {
    const priorityReverseMap: Record<number, string> = { 1: 'high', 2: 'medium', 3: 'low' };
    const statusReverseMap: Record<number, string> = { 1: 'completed', 2: 'pending', 3: 'in-progress' };

    this.categories = this.data.categories;

    console.log('Categories loaded:', this.categories);

    this.form = this.fb.group({
      title: [this.data?.task?.title || '', Validators.required],
      description: [this.data?.task?.description || ''],
      startDate: [
        this.data?.task?.startEventDate ? this.data.task.startEventDate : this.formatDate(new Date()),
        Validators.required,
      ],
      endDate: [
        this.data?.task?.endEventDate ? this.data.task.endEventDate : this.formatDate(new Date()),
        Validators.required,
      ],
      priority: [
        this.data?.task
          ? priorityReverseMap[Number(this.data.task.priority)] || 'medium'
          : 'medium',
        Validators.required,
      ],
      status: [
        this.data?.task
          ? statusReverseMap[Number(this.data.task.status)] || 'pending'
          : 'pending',
        Validators.required,
      ],
      category: [
        this.data?.task
          ? this.data.task.category
          : (this.categories[0]?.id ?? null),
        Validators.required,
      ],
    }, { validators: this.endDateAfterStartDate });
  }

  formatDate(date: Date | string) {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const priorityMap: Record<string, number> = { low: 3, medium: 2, high: 1 };
      const statusMap: Record<string, number> = { pending: 2, 'in-progress': 3, completed: 1 };

      function toLocalDateString(date: any): string {
        if (typeof date === 'string') return date;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const startEventDate = toLocalDateString(formValue.startDate);
      const endEventDate = toLocalDateString(formValue.endDate);

      const mapped = {
        ...formValue,
        startEventDate,
        endEventDate,
        priority: priorityMap[formValue.priority] ?? 2,
        status: statusMap[formValue.status] ?? 2,
        category: formValue.category,
};
      console.log(mapped);

      this.dialogRef.close(mapped);
    }
  }

  endDateAfterStartDate(group: FormGroup) {
    const start = new Date(group.get('startDate')?.value);
    const end = new Date(group.get('endDate')?.value);
    return end >= start ? null : { endBeforeStart: true };
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
