import { inject, Injectable } from '@angular/core';

import { UserRepositoryService } from '@shared/services/user-repository.service';

@Injectable()
export class UsuarioService {
  private readonly userRepositoryService = inject(UserRepositoryService);

  getUsers() {
    return this.userRepositoryService.getAll();
  }
}
