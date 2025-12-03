import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';
import { CredentialsDto, GroupDto, RoleDto } from '@shared/models/user/user.shared';

export abstract class UserRepositoryService {
  // -------------------------------
  // USERS
  // -------------------------------

  /** GET /users */
  abstract getAll(): Observable<UserResponseDto[]>;

  /** GET /users/{id} */
  abstract getById(id: string): Observable<UserResponseDto>;

  /** GET /users/me */
  abstract getCurrent(): Observable<{ message: string }>;

  /** POST /users */
  abstract create(user: UserRequestDto): Observable<UserResponseDto>;

  /** PUT /users */
  abstract update(id: string, user: UserRequestDto): Observable<UserResponseDto>;

  /** DELETE /users/{id} */
  abstract delete(id: string): Observable<void>;

  /** PUT /users/{id}/password */
  abstract updatePassword(id: string, credentials: CredentialsDto): Observable<void>;

  /** POST /users/{id}/role */
  abstract addRole(id: string, roles: RoleDto[]): Observable<void>;

  /** DELETE /users/{id}/role */
  abstract deleteRole(id: string, role: RoleDto): Observable<void>;

  /** POST /users/{id}/group/{groupId} */
  abstract addToGroup(id: string, groupId: string): Observable<void>;

  /** DELETE /users/{id}/group/{groupId} */
  abstract removeFromGroup(id: string, groupId: string): Observable<void>;

  /** GET /users/roles */
  abstract getAllRoles(): Observable<RoleDto[]>;

  /** GET /users/groups */
  abstract getAllGroups(): Observable<GroupDto[]>;
}

export class UserRepositoryRemoteService implements UserRepositoryService {
  private readonly configurationService = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.configurationService.getConfig().backend?.url + '/users';
  }

  // -------------------------------
  // USERS
  // -------------------------------

  /** GET /users */
  getAll(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.baseUrl);
  }

  /** GET /users/{id} */
  getById(id: string): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUrl}/${id}`);
  }

  /** GET /users/me */
  getCurrent(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/me`);
  }

  /** POST /users */
  create(user: UserRequestDto): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(this.baseUrl, user);
  }

  update(id: string, user: UserRequestDto): Observable<UserResponseDto> {
    return this.http.put<UserResponseDto>(`${this.baseUrl}/${id}`, user);
  }

  /** DELETE /users/{id} */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** PUT /users/{id}/password */
  updatePassword(id: string, credentials: CredentialsDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/password`, credentials);
  }

  /** POST /users/{id}/role */
  addRole(id: string, roles: RoleDto[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/role`, roles);
  }

  /** DELETE /users/{id}/role */
  deleteRole(id: string, role: RoleDto): Observable<void> {
    return this.http.request<void>('DELETE', `${this.baseUrl}/${id}/role`, {
      body: role,
    });
  }

  /** POST /users/{id}/group/{groupId} */
  addToGroup(id: string, groupId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/group/${groupId}`, null);
  }

  /** DELETE /users/{id}/group/{groupId} */
  removeFromGroup(id: string, groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/group/${groupId}`);
  }

  /** GET /users/roles */
  getAllRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.baseUrl}/roles`);
  }

  /** GET /users/groups */
  getAllGroups(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(`${this.baseUrl}/groups`);
  }
}
