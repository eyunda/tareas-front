import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StateService } from './state.service';
import { State } from '../models/state';
import { environment } from '../../environments/environment';

describe('StateService', () => {
  let service: StateService;
  let httpMock: HttpTestingController;

  const dummyStates: State[] = [
    { id: 1, name: 'Por Hacer' },
    { id: 2, name: 'En Progreso' },
    { id: 3, name: 'Completada' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve states via GET', () => {
    service.getStates().subscribe(states => {
      expect(states.length).toBe(3);
      expect(states).toEqual(dummyStates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/states`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStates);
  });
});
