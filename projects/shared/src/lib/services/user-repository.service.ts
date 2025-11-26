import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { HttpClient } from '@angular/common/http';

export abstract class UserRepositoryService {
  abstract getAll(): Observable<IUser[]>;
  abstract create(user: IUser): Observable<IUser>;
  abstract update(id: string, user: Partial<IUser>): Observable<IUser | undefined>;
  abstract delete(id: string): Observable<void>;
}

export class UserRepositoryRemoteService implements UserRepositoryService {
  private readonly configurationService = inject(ConfigurationService);
  private readonly http = inject(HttpClient);

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = this.configurationService.getConfig().backend + '/users';
  }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.baseUrl}`);
  }

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}`, user);
  }

  update(id: string, user: Partial<IUser>): Observable<IUser | undefined> {
    return this.http.put<IUser>(`${this.baseUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export interface IUser {
  id?: string;
  username?: string;
  email?: string;
  role?: Role;
  locked?: boolean;
}

export enum Role {
  OPERATOR = 'OPERATOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  SUPERVISOR = 'SUPERVISOR',
  CLIENT = 'CLIENT',
  EURODAC = 'EURODAC',
  MBI = 'MBI',
}
