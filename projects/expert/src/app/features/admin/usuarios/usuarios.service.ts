import { inject, Injectable } from '@angular/core';

import { IUser, UserRepositoryService } from '@shared/services/user-repository.service';
import { Observable } from 'rxjs';

@Injectable()
export class UsuarioService {
  private readonly userRepositoryService = inject(UserRepositoryService);

  getUsers() {
    return this.userRepositoryService.getAll();
  }

  update(id: string, user: IUser): Observable<IUser | undefined> {
    return this.userRepositoryService.update(id, user);
  }

  create(user: IUser): Observable<IUser> {
    return this.userRepositoryService.create(user);
  }

  delete(id: string): Observable<void> {
    return this.userRepositoryService.delete(id);
  }
}
