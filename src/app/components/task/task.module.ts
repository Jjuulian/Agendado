// src/app/components/task/task.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItemComponent } from '../../dashboard/components/task-item/task-item.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, TaskItemComponent],
  exports: [TaskItemComponent] 
})
export class TaskModule {}
