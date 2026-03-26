export interface Provider {
  idProvider: number;
  name: string;
  phone: string;
}

export interface CreateProviderDto {
  name: string;
  phone: string;
}

export interface EditProviderDto {
  idProvider: number;
  name: string;
  phone: string;
}
