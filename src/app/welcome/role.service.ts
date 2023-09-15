import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private userRoles: string[] = [];

  setUserRoles(roles: string[]) {
    this.userRoles = roles;
  }

  getUserRoles(): string[] {
    return this.userRoles;
  }
}
