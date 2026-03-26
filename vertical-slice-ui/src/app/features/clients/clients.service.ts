import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientDto, EditClientDto } from './models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private http = inject(HttpClient);

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>('/api/client/getAll');
  }

  create(dto: CreateClientDto): Observable<void> {
    return this.http.post<void>('/api/client/new', dto);
  }

  edit(dto: EditClientDto): Observable<void> {
    return this.http.put<void>('/api/client/edit', dto);
  }

  delete(idClient: number): Observable<void> {
    return this.http.delete<void>(`/api/client/delete?idClient=${idClient}`);
  }
}
