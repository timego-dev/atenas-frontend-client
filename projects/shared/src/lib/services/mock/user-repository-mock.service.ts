import { Observable, of } from 'rxjs';
import { IUser, Role, UserRepositoryService } from '../user-repository.service';

export class UserRepositoryMockService implements UserRepositoryService {
  private users: IUser[] = <IUser[]>[
    {
      id: '1',
      username: 'admin',
      email: 'admin@localhost',
      role: Role.ADMINISTRATOR,
      locked: false,
    },
    {
      id: '2',
      username: 'user',
      email: 'user@localhost',
      role: Role.CLIENT,
      locked: false,
    },
  ];

  getAll(): Observable<IUser[]> {
    return of(this.users);
  }

  create(user: IUser): Observable<IUser> {
    this.users = [...this.users, user];
    return of(user);
  }

  update(id: string, user: Partial<IUser>): Observable<IUser | undefined> {
    // busca el índice del usuario
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return of(undefined);
    }

    // mezcla los campos nuevos con los existentes
    const updatedUser = { ...this.users[index], ...user };

    // reemplaza en la lista
    this.users = [...this.users.slice(0, index), updatedUser, ...this.users.slice(index + 1)];

    return of(updatedUser);
  }

  delete(id: string): Observable<void> {
    this.users = this.users.filter((u) => u.id !== id);
    return of();
  }
}
