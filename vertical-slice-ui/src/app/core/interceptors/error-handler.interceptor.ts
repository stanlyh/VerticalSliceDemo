import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado del servidor.';

      if (error.status === 400) {
        message = error.error?.message ?? 'Datos inválidos. Revisa los campos.';
      } else if (error.status === 404) {
        message = 'Registro no encontrado.';
      } else if (error.status === 409) {
        message = 'El registro ya existe o hay un conflicto.';
      } else if (error.status === 500) {
        message = 'Error interno del servidor.';
      } else if (error.status === 0) {
        message = 'No se pudo conectar con el servidor.';
      }

      toast.show(message, 'error');
      return EMPTY;
    })
  );
};
