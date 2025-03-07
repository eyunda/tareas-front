import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const dummyTasks = [
    { id: '1', title: 'Tarea 1', description: 'Descripción 1', stateId: 1, stateName: 'Por Hacer' },
    { id: '2', title: 'Tarea 2', description: 'Descripción 2', stateId: 2, stateName: 'En Progreso' }
  ];

  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'createTask', 'updateTask', 'deleteTask']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [MatTableModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: TaskService, useValue: taskSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    matDialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('debería cargar las tareas al iniciar', () => {
    const dummyTasks = [
      { id: '1', title: 'Tarea 1', description: 'Desc 1', stateId: 1, stateName: 'Por Hacer' },
      { id: '2', title: 'Tarea 2', description: 'Desc 2', stateId: 2, stateName: 'En Progreso' }
    ];
    taskServiceSpy.getTasks.and.returnValue(of(dummyTasks));
    fixture.detectChanges();
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(dummyTasks);
  });
  

  it('debería llamar a createTask al agregar una tarea', () => {
    const dialogRefSpyObj = { afterClosed: () => of({ title: 'Nueva', description: 'Desc nueva', stateId: 1 }) };
    matDialogSpy.open.and.returnValue(dialogRefSpyObj as any);
  
    const newTask = {
      id: '3',
      title: 'Nueva',
      description: 'Desc nueva',
      stateId: 1,
      stateName: 'Por Hacer'
    };
    taskServiceSpy.createTask.and.returnValue(of(newTask));
  
    component.openAddTask();
  
    expect(matDialogSpy.open).toHaveBeenCalled();
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith({ title: 'Nueva', description: 'Desc nueva', stateId: 1 });
    expect(component.dataSource.data).toContain(newTask);
  });
  

  it('debería llamar a updateTask al editar una tarea', () => {
    const dummyTask = { id: '1', title: 'Original', description: 'Desc', stateId: 1, stateName: 'Por Hacer' };
    component.dataSource.data = [dummyTask];
  
    const dialogRefSpyObj = { afterClosed: () => of({ title: 'Editado', description: 'Desc Editado', stateId: 2 }) };
    matDialogSpy.open.and.returnValue(dialogRefSpyObj as any);
  
    const updatedTask = { ...dummyTask, title: 'Editado', description: 'Desc Editado', stateId: 2, stateName: 'En Progreso' };
    taskServiceSpy.updateTask.and.returnValue(of(updatedTask));
  
    component.openEditTask(dummyTask);
  
    expect(matDialogSpy.open).toHaveBeenCalled();
    expect(taskServiceSpy.updateTask).toHaveBeenCalledWith(updatedTask);
    expect(component.dataSource.data[0]).toEqual(updatedTask);
  });
  

  it('debería llamar a deleteTask al eliminar una tarea', () => {
    taskServiceSpy.deleteTask.and.returnValue(of(undefined));
    component.deleteTask('1');
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
  });
});
