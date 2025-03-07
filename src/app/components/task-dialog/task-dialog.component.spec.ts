import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDialogComponent, TaskData } from './task-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateService } from '../../services/state.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Importar módulos de Angular Material necesarios para el template
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;

  const mockDialogData: TaskData = { title: 'Prueba', description: 'Descripción de prueba', stateId: 1 };

  const dummyStates = [
    { id: 1, name: 'Por Hacer' },
    { id: 2, name: 'En Progreso' },
    { id: 3, name: 'Completada' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StateService', ['getStates']);
    await TestBed.configureTestingModule({
      declarations: [TaskDialogComponent],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule
      ],
      providers: [
        { provide: StateService, useValue: spy },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    stateServiceSpy = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
  });

  it('debería cargar los estados al iniciar', () => {
    const dummyStates = [
      { id: 1, name: 'Por Hacer' },
      { id: 2, name: 'En Progreso' },
      { id: 3, name: 'Completada' }
    ];
  
    stateServiceSpy.getStates.and.returnValue(of(dummyStates));
  
    fixture.detectChanges();
  
    expect(stateServiceSpy.getStates).toHaveBeenCalled();
    expect(component.states).toEqual(dummyStates);
  });
  

  it('debería cerrar el diálogo sin datos al cancelar', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith();
  });
  

  it('debería cerrar el diálogo retornando datos al guardar', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.data = { title: 'Prueba', description: 'Desc', stateId: 1 };
    component.onSave();
    expect(dialogRef.close).toHaveBeenCalledWith({ title: 'Prueba', description: 'Desc', stateId: 1 });
  });
  
});
