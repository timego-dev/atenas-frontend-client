import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserRepositoryService } from '@shared/services/user-repository.service';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';
import { CredentialsDto, GroupDto, RoleDto } from '@shared/models/user/user.shared';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly userRepositoryService = inject(UserRepositoryService);

  // -------------------------------
  // USERS
  // -------------------------------

  getAll(): Observable<UserResponseDto[]> {
    return this.userRepositoryService.getAll();
  }

  getById(id: string): Observable<UserResponseDto> {
    return this.userRepositoryService.getById(id);
  }

  getCurrent(): Observable<{ message: string }> {
    return this.userRepositoryService.getCurrent();
  }

  create(user: UserRequestDto): Observable<UserResponseDto> {
    return this.userRepositoryService.create(user);
  }

  delete(id: string): Observable<void> {
    return this.userRepositoryService.delete(id);
  }

  update(id: string, user: UserRequestDto): Observable<UserResponseDto> {
    return this.userRepositoryService.update(id, user);
  }

  updatePassword(id: string, credentials: CredentialsDto): Observable<void> {
    return this.userRepositoryService.updatePassword(id, credentials);
  }

  // -------------------------------
  // ROLES
  // -------------------------------

  addRole(userId: string, roles: RoleDto[]): Observable<void> {
    return this.userRepositoryService.addRole(userId, roles);
  }

  removeRole(userId: string, role: RoleDto): Observable<void> {
    return this.userRepositoryService.deleteRole(userId, role);
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.userRepositoryService.getAllRoles();
  }

  // -------------------------------
  // GROUPS
  // -------------------------------

  addToGroup(userId: string, groupId: string): Observable<void> {
    return this.userRepositoryService.addToGroup(userId, groupId);
  }

  removeFromGroup(userId: string, groupId: string): Observable<void> {
    return this.userRepositoryService.removeFromGroup(userId, groupId);
  }

  getAllGroups(): Observable<GroupDto[]> {
    return this.userRepositoryService.getAllGroups();
  }
}
