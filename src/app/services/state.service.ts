import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models/state';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Define la URL base para estados (asegúrate de definirla en environment.ts o cámbiala aquí)
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/states`);
  }
}
