import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent, TaskData } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'stateName', 'actions'];
  dataSource = new MatTableDataSource<Task>();

  constructor(private taskService: TaskService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.dataSource.data = tasks;
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  openAddTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { title: '', description: '', stateId: 1 } as TaskData
    });

    dialogRef.afterClosed().subscribe((result: TaskData) => {
      if (result) {
        this.taskService.createTask(result).subscribe({
          next: (newTask) => {
            this.dataSource.data = [...this.dataSource.data, newTask];
          },
          error: (err) => console.error('Error al crear tarea:', err)
        });
      }
    });
  }

  openEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { ...task }
    });

    dialogRef.afterClosed().subscribe((result: TaskData) => {
      if (result) {
        this.taskService.updateTask({ ...task, ...result }).subscribe({
          next: (updatedTask) => {
            const index = this.dataSource.data.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
              const updatedData = [...this.dataSource.data];
              updatedData[index] = updatedTask;
              this.dataSource.data = updatedData;
            }
          },
          error: (err) => console.error('Error al actualizar tarea:', err)
        });
      }
    });
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(task => task.id !== id);
      },
      error: (err) => console.error('Error al eliminar tarea:', err)
    });
  }
}
