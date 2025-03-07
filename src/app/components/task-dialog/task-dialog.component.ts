import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { State } from '../../models/state';
import { StateService } from '../../services/state.service';

export interface TaskData {
  id?: string;
  title: string;
  description: string;
  stateId: number;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html'
})
export class TaskDialogComponent implements OnInit {

  states: State[] = [];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskData,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates(): void {
    this.stateService.getStates().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (err) => console.error('Error al cargar estados:', err)
    });
  }

  onSave(): void {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
