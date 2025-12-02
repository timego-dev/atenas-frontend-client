import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IUser, Role, UserRepositoryMockService, UserRepositoryService } from '@shared';

import { AuthService } from '@shared/services/auth.service';
import { AuthMockService } from '@shared/services/mock/auth-mock.service';

describe('Usuarios service', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: UserRepositoryService, useClass: UserRepositoryMockService },
        { provide: AuthService, useClass: AuthMockService },
      ],
    }).compileComponents();
  });

  describe('Service tests', () => {
    it('should receive users', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let users!: IUser[];
      service.getAll().subscribe((u) => {
        users = u;
      });

      tick();
      expect(users.length).toBe(9);

      //TODO
      // Comprobar que com a mínim hi ha un usuari amb rol administrador
    }));

    it('should create new user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let users!: IUser[];

      service.getAll().subscribe((u) => {
        users = u;
      });
      tick();

      expect(users.length).toBe(9);

      let newUser!: IUser;

      service
        .create({
          username: 'newuser',
          email: 'mail@mail.com',
          role: Role.EURODAC,
          locked: false,
        })
        .subscribe((u) => {
          newUser = u;
        });
      tick();

      expect(newUser.id).toBeDefined();
      expect(newUser.username).toBe('newuser');
      expect(newUser.email).toBe('mail@mail.com');
      expect(newUser.role).toBe(Role.EURODAC);
      expect(newUser.locked).toBeFalse();

      let usersAfterCreate!: IUser[];

      service.getAll().subscribe((u) => {
        usersAfterCreate = u;
      });
      tick();

      expect(usersAfterCreate.length).toBe(10);
    }));

    it('should update existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let updatedUser!: IUser | undefined;

      service.update('1', { username: 'updatedName' }).subscribe((u) => {
        updatedUser = u;
      });
      tick();

      expect(updatedUser).toBeDefined();
      expect(updatedUser!.id).toBe('1');
      expect(updatedUser!.username).toBe('updatedName');

      let usersAfterUpdate!: IUser[];

      service.getAll().subscribe((u) => {
        usersAfterUpdate = u;
      });
      tick();

      const user = usersAfterUpdate.find((u) => u.id === '1');
      expect(user).toBeDefined();
      expect(user!.username).toBe('updatedName');
    }));

    it('should return undefined when updating non existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let updatedUser!: IUser | undefined;

      service.update('non-existing-id', { username: 'updatedName' }).subscribe((u) => {
        updatedUser = u;
      });
      tick();

      expect(updatedUser).toBeUndefined();
    }));

    it('should delete existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      service.delete('1').subscribe(() => {});
      tick();

      let usersAfterDelete!: IUser[];

      service.getAll().subscribe((u) => {
        usersAfterDelete = u;
      });
      tick();

      expect(usersAfterDelete.length).toBe(8);
      const user = usersAfterDelete.find((u) => u.id === '1');
      expect(user).toBeUndefined();

      //TODO
      // Comprovar que si l'usuari eliminat era l'únic administrador, ara n'hi ha un altre
      // Comprovar que no es pugui eliminar el propi usuari actiu
    }));

    it('should do nothing when deleting non existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      service.delete('non-existing-id').subscribe(() => {});
      tick();

      let usersAfterDelete!: IUser[];
      service.getAll().subscribe((u) => {
        usersAfterDelete = u;
      });
      tick();

      expect(usersAfterDelete.length).toBe(9);
    }));

    it("No ha de poder eliminar l'usuari actiu", fakeAsync(() => {
      const auth = TestBed.inject(AuthService);
      const service = TestBed.inject(UserRepositoryService);

      // Preconditions

      // Simular estar logat amb l'usuari d'id '1'
      (auth as AuthMockService).applyBehavior({ userName: '1' });

      // Tests
      service.delete('1').subscribe({
        next: () => {
          fail("S'ha d'haver produït un error al eliminar l'usuari actiu");
        },
        error: () => {},
      });
      tick();
    }));
  });
});
