import { Observable, of } from 'rxjs';
import { IUser, Role, UserRepositoryService } from '../user-repository.service';

export class UserRepositoryMockService implements UserRepositoryService {
  private users: IUser[] = <IUser[]>[
    {
      id: '1',
      username: 'joan.vilaseca',
      email: 'joan.vilaseca@bioidenti.com',
      role: Role.ADMINISTRATOR,
      locked: false,
    },
    {
      id: '2',
      username: 'jcarles.vilaseca',
      email: 'jcarles.vilaseca@bioidenti.com',
      role: Role.SUPERVISOR,
      locked: false,
    },
    {
      id: '3',
      username: 'joan.valls',
      email: 'joan.valls@bioidenti.com',
      role: Role.CLIENT,
      locked: false,
    },
    {
      id: '4',
      username: 'jluis.iglesias',
      email: 'jluis.iglesias@bioidenti.com',
      role: Role.MBI,
      locked: true,
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
