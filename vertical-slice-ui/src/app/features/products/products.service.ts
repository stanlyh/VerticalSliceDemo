import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductDto, EditProductDto } from './models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/product/getAll');
  }

  create(dto: CreateProductDto): Observable<void> {
    return this.http.post<void>('/api/product/new', dto);
  }

  edit(dto: EditProductDto): Observable<void> {
    return this.http.put<void>('/api/product/edit', dto);
  }

  delete(idProduct: number): Observable<void> {
    return this.http.delete<void>(`/api/product/delete?idProduct=${idProduct}`);
  }
}
