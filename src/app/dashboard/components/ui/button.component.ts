import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      [ngClass]="[
        baseClass,
        variantClass,
        sizeClass,
        className
      ].join(' ')"
      [disabled]="disabled"
      (click)="onClick?.()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() size: 'default' | 'icon' = 'default';
  @Input() className: string = '';
  @Input() disabled: boolean = false;
  @Input() onClick?: () => void;

  baseClass =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  get variantClass(): string {
    return this.variant === 'outline'
      ? 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-100'
      : 'bg-blue-600 text-white hover:bg-blue-700';
  }

  get sizeClass(): string {
    return this.size === 'icon' ? 'h-9 w-9' : 'h-9 px-4 py-2';
  }
}
