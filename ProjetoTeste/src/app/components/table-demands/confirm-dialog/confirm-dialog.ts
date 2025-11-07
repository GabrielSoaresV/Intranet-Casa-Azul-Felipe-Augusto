// src/app/components/table-demands/confirm-dialog/confirm-dialog.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'primary' | 'accent' | 'warn';
  askNotes?: boolean;
  notesLabel?: string;
  notesPlaceholder?: string;
  defaultNotes?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.css']
})
export class ConfirmDialog {
  notes = this.data?.defaultNotes || '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  confirm(): void {
    this.dialogRef.close({ confirmed: true, notes: this.notes });
  }
}
