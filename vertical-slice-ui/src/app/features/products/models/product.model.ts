export interface Product {
  idProduct: number;
  name: string;
  price: number;
}

export interface CreateProductDto {
  name: string;
  price: number;
}

export interface EditProductDto {
  idProduct: number;
  name: string;
  price: number;
}
