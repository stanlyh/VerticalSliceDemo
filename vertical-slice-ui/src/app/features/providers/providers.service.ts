import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider, CreateProviderDto, EditProviderDto } from './models/provider.model';

@Injectable({ providedIn: 'root' })
export class ProvidersService {
  private http = inject(HttpClient);

  getAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>('/api/provider/getAll');
  }

  create(dto: CreateProviderDto): Observable<void> {
    return this.http.post<void>('/api/provider/new', dto);
  }

  edit(dto: EditProviderDto): Observable<void> {
    return this.http.put<void>('/api/provider/edit', dto);
  }

  delete(idProvider: number): Observable<void> {
    return this.http.delete<void>(`/api/provider/delete?idProvider=${idProvider}`);
  }
}
