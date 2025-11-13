import { Observable, of } from 'rxjs';
import { IUser, Role, UserRepositoryService } from '../user-repository.service';

export class UserRepositoryMockService implements UserRepositoryService {
  private users: IUser[] = <IUser[]>[
    {
      id: '1',
      username: 'Joan Vilaseca',
      email: 'joan.vilaseca@bioidenti.com',
      role: Role.ADMINISTRATOR,
      locked: false,
    },
    {
      id: '2',
      username: 'JCarles Vilaseca',
      email: 'jcarles.vilaseca@bioidenti.com',
      role: Role.SUPERVISOR,
      locked: false,
    },
    {
      id: '3',
      username: 'Joan Valls',
      email: 'joan.valls@bioidenti.com',
      role: Role.CLIENT,
      locked: false,
    },
    {
      id: '4',
      username: 'José Luis Iglesias',
      email: 'jluis.iglesias@bioidenti.com',
      role: Role.MBI,
      locked: true,
    },
    {
      id: '5',
      username: 'Maite Gramunt',
      email: 'maite.gramunt@bioidenti.com',
      role: Role.EURODAC,
      locked: false,
    },
    {
      id: '6',
      username: 'Carles Caurín',
      email: 'carles.caurin@bioidenti.com',
      role: Role.SUPERVISOR,
      locked: false,
    },
    {
      id: '7',
      username: 'Oscar Lorenzo',
      email: 'oscar.lorenzo@bioidenti.com',
      role: Role.MBI,
      locked: false,
    },
    {
      id: '8',
      username: 'Mireia Arce',
      email: 'mireia.arce@bioidenti.com',
      role: Role.MBI,
      locked: false,
    },
    {
      id: '9',
      username: 'Joan Margineda',
      email: 'joan.margineda@bioidenti.com',
      role: Role.OPERATOR,
      locked: false,
    },
  ];

  getAll(): Observable<IUser[]> {
    return of(this.users);
  }

  create(user: IUser): Observable<IUser> {
    user.id = (this.users.length + 1).toString();
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
