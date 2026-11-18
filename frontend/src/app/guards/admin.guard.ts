import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from '../services/data.service';

/**
 * Guarda de rota que restringe acesso estritamente a usuários com perfil de Administrador.
 */
export const adminGuard: CanActivateFn = () => {
  const dataService = inject(DataService);
  const router = inject(Router);

  if (dataService.isAdmin()) {
    return true;
  }

  dataService.showToast('Acesso restrito à Coordenação Escolar.', 'error');
  router.navigate(['/professor-calendario']);
  return false;
};
