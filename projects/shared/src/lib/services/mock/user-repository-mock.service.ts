import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMockApiService } from './base-mock-api.service';
import { UserRepositoryService } from '@shared';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { CredentialsDto, GroupDto, RoleDto, RoleType } from '@shared/models/user/user.shared';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryMockService extends BaseMockApiService implements UserRepositoryService {
  private users: UserResponseDto[] = [
    {
      id: '80f96bd2-d528-476a-9307-6eb6df4ab387',
      username: 'admin1',
      firstName: 'Admin',
      lastName: 'One',
      email: 'admin1@demo.local',
      emailVerified: false,
      enabled: true,
      totp: false,
      credentials: null,
      roles: [{ id: 'be1d83d5-4006-4d5d-bf09-aae78b5fdb59', name: RoleType.ADMINISTRATOR }],
      groups: [{ id: 'b7ecc368-737c-46da-9a7e-cefa0d6b3a27', name: 'experts' }],
    },
    {
      id: '86402aeb-b74d-4f13-b00e-bebf2c2273f0',
      username: 'atenasclient1',
      firstName: 'Atenas',
      lastName: 'Client',
      email: 'atenasclient1@demo.local',
      emailVerified: false,
      enabled: true,
      totp: false,
      credentials: null,
      roles: [{ id: 'dbc34276-0957-451b-adb3-9706bca0a59d', name: RoleType.ATENAS_CLIENT }],
      groups: [{ id: 'a47fac6e-da2c-4f55-ae0b-df1e30ef8a8e', name: 'clients' }],
    },
    {
      id: '7f2c1595-2b08-4c44-9e5a-3b5c51b4be85',
      username: 'eurodacclient1',
      firstName: 'Eurodac',
      lastName: 'Client',
      email: 'eurodacclient1@demo.local',
      emailVerified: false,
      enabled: true,
      totp: false,
      credentials: null,
      roles: [{ id: '9475202f-045d-469a-8e84-9977ca4eff37', name: RoleType.EURODAC_CLIENT }],
      groups: [{ id: 'a47fac6e-da2c-4f55-ae0b-df1e30ef8a8e', name: 'clients' }],
    },
    {
      id: '9b40dc95-1ebe-4c63-8fd2-c3b5119a5c99',
      username: 'operator1',
      firstName: 'Operator',
      lastName: 'One',
      email: 'operator1@demo.local',
      emailVerified: false,
      enabled: true,
      totp: false,
      credentials: null,
      roles: [{ id: 'e58187d9-f6be-4d5a-9455-15d477e10210', name: RoleType.OPERATOR }],
      groups: [{ id: 'b7ecc368-737c-46da-9a7e-cefa0d6b3a27', name: 'experts' }],
    },
  ];

  private roles: RoleDto[] = [
    { id: 'e58187d9-f6be-4d5a-9455-15d477e10210', name: RoleType.OPERATOR },
    { id: 'be1d83d5-4006-4d5d-bf09-aae78b5fdb59', name: RoleType.ADMINISTRATOR },
    { id: 'dbc34276-0957-451b-adb3-9706bca0a59d', name: RoleType.ATENAS_CLIENT },
    { id: '9475202f-045d-469a-8e84-9977ca4eff37', name: RoleType.EURODAC_CLIENT },
    { id: 'c219f3ce-57c0-4900-bf5d-4bce61ee4910', name: RoleType.SUPERVISOR },
  ];

  private groups: GroupDto[] = [
    { id: 'a47fac6e-da2c-4f55-ae0b-df1e30ef8a8e', name: 'clients' },
    { id: 'b7ecc368-737c-46da-9a7e-cefa0d6b3a27', name: 'experts' },
  ];

  // ONLY DESIGNED FOR MOCK CASES
  getUsersByGroup(groupName: string): UserResponseDto[] {
    return this.users.filter((u) => u.groups?.some((g) => g.name === groupName));
  }

  getRandomUser(): UserResponseDto {
    return this.users[Math.floor(Math.random() * this.users.length)];
  }

  getRandomUserByGroup(groupName: string): UserResponseDto | null {
    const groupUsers = this.getUsersByGroup(groupName);
    if (!groupUsers.length) return null;
    return groupUsers[Math.floor(Math.random() * groupUsers.length)];
  }
  // ----------------------------------

  // -------------------------------
  // USERS
  // -------------------------------

  getAll(): Observable<UserResponseDto[]> {
    return this.handleUnauthorized(() => this.ok(this.users));
  }

  getById(id: string): Observable<UserResponseDto> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      return user ? this.ok(user) : this.notFound();
    });
  }

  getCurrent(): Observable<{ message: string }> {
    return this.handleUnauthorized(() => this.ok({ message: 'Mocked current user' }));
  }

  create(user: UserRequestDto): Observable<UserResponseDto> {
    return this.handleUnauthorized(() => {
      const newUser: UserResponseDto = {
        ...user,
        id: crypto.randomUUID(),
        emailVerified: false,
        totp: false,
        credentials: null,
        roles: [],
        groups: [],
      };
      this.users.push(newUser);
      return this.created(newUser);
    });
  }

  update(id: string, user: UserRequestDto): Observable<UserResponseDto> {
    return this.handleUnauthorized(() => {
      const existing = this.users.find((u) => u.id === id);
      if (!existing) return this.notFound();

      // Update only editable fields
      existing.username = user.username ?? existing.username;
      existing.firstName = user.firstName ?? existing.firstName;
      existing.lastName = user.lastName ?? existing.lastName;
      existing.email = user.email ?? existing.email;
      existing.enabled = user.enabled;

      return this.ok(existing);
    });
  }

  delete(id: string): Observable<void> {
    return this.handleUnauthorized(() => {
      const index = this.users.findIndex((u) => u.id === id);
      if (index === -1) return this.notFound();
      this.users.splice(index, 1);
      return this.ok();
    });
  }

  updatePassword(id: string, credentials: CredentialsDto): Observable<void> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      return user ? this.ok() : this.notFound();
    });
  }

  addRole(id: string, roles: RoleDto[]): Observable<void> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      if (!user) return this.notFound();

      user.roles = [...(user.roles ?? [])];
      roles.forEach((r) => {
        if (!user.roles!.some((existing) => existing.id === r.id)) {
          user.roles!.push(r);
        }
      });

      return this.ok();
    });
  }

  deleteRole(id: string, role: RoleDto): Observable<void> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      if (!user) return this.notFound();

      user.roles = (user.roles ?? []).filter((r) => r.id !== role.id);
      return this.ok();
    });
  }

  addToGroup(id: string, groupId: string): Observable<void> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      const group = this.groups.find((g) => g.id === groupId);
      if (!user || !group) return this.notFound();

      user.groups = [...(user.groups ?? [])];
      if (!user.groups.some((g) => g.id === group.id)) {
        user.groups.push(group);
      }

      return this.ok();
    });
  }

  removeFromGroup(id: string, groupId: string): Observable<void> {
    return this.handleUnauthorized(() => {
      const user = this.users.find((u) => u.id === id);
      if (!user) return this.notFound();

      user.groups = (user.groups ?? []).filter((g) => g.id !== groupId);
      return this.ok();
    });
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.handleUnauthorized(() => this.ok(this.roles));
  }

  getAllGroups(): Observable<GroupDto[]> {
    return this.handleUnauthorized(() => this.ok(this.groups));
  }
}
