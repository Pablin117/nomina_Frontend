import { Injectable } from '@angular/core';
import {CanActivate, CanActivateFn, Router} from '@angular/router';
import { RoleService } from './role.service'; // Importa tu servicio

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private roleService: RoleService) { }

  canActivate(): boolean {
    const allowedRoles = ['1', '2']; // Define los roles permitidos

    // Obtiene los roles del usuario desde el servicio
    const userRoles = this.roleService.getUserRoles();
    console.log('Este es el userRoles'+userRoles)
    if (userRoles.includes('1')) {
      this.router.navigate(['/welcome']);
      return true; // El usuario tiene permiso para acceder
    } else if (userRoles.includes('2')) {
      alert('tienes rol 2')
      this.router.navigate(['/planilla']);
      return true; // El usuario tiene permiso para acceder
      } else {
      alert('No tienes roles')
      this.router.navigate(['/']); // Redirige a la página de acceso denegado por defecto
      return false;
      }
  }

  private userHasPermission(allowedRoles: string[], userRoles: string[]): boolean {
    // Implementa tu lógica para verificar si el usuario tiene los roles permitidos.
    // Esto podría ser una comparación entre los roles permitidos y los roles del usuario.
    return allowedRoles.some(role => userRoles.includes(role));
  }

  hasRol(): boolean{
    return false;
  }

}
