import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../model/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private http = inject(HttpClient);
  private API_PRODUCTOS = 'https://app-dron-a6653-default-rtdb.firebaseio.com';


  getProductos(): Observable<Product[]> {
    return this.http.get<{ [key: string]: Product }>(`${this.API_PRODUCTOS}/productos.json`).pipe(
      map(respuesta => {
        if (!respuesta) {
          return [];
        }
        return Object.keys(respuesta).map(id => {
          const productoConId = { ...respuesta[id], id: id };
          return productoConId;
        })
      })
    )
  }

  postProductos(producto: Product): Observable<Product> {
    return this.http.post<Product>(`${this.API_PRODUCTOS}/productos.json`, producto);
  }

  putProducto(id: string, producto: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_PRODUCTOS}/productos/${id}.json`, producto);
  }

  deleteProduto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_PRODUCTOS}/productos/${id}.json`);

  }

}
