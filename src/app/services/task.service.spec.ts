import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const dummyTasks: Task[] = [
    { id: '1', title: 'Tarea 1', description: 'Descripción 1', stateId: 1, stateName: 'Por Hacer' },
    { id: '2', title: 'Tarea 2', description: 'Descripción 2', stateId: 2, stateName: 'En Progreso' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener las tareas con GET', () => {
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('debería crear una tarea con POST', () => {
    const newTask = { title: 'Nueva tarea', description: 'Descripción', stateId: 1 } as Partial<Task>;
    const createdTask = { id: '3', title: 'Nueva tarea', description: 'Descripción', stateId: 1, stateName: 'Por Hacer' } as Task;

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush(createdTask);
  });

  it('debería actualizar una tarea con PUT', () => {
    const taskToUpdate = { id: '1', title: 'Tarea actualizada', description: 'Descripción actualizada', stateId: 2, stateName: 'En Progreso' } as Task;

    service.updateTask(taskToUpdate).subscribe(task => {
      expect(task).toEqual(taskToUpdate);
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskToUpdate.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(taskToUpdate);
  });

  it('debería eliminar una tarea con DELETE', () => {
    const taskId = '1';
    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  
});
