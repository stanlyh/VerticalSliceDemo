export interface Client {
  idClient: number;
  name: string;
  email: string;
}

export interface CreateClientDto {
  name: string;
  email: string;
}

export interface EditClientDto {
  idClient: number;
  name: string;
  email: string;
}
