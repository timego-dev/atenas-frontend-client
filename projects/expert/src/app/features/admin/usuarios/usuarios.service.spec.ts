import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserRepositoryMockService, UserRepositoryService } from '@shared';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';

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

      let users!: UserResponseDto[];
      service.getAll().subscribe((u) => {
        users = u;
      });

      tick();
      expect(users.length).toBe(4);

      //TODO
      // Comprobar que com a mínim hi ha un usuari amb rol administrador
    }));

    it('should create new user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let users!: UserResponseDto[];

      service.getAll().subscribe((u) => {
        users = u;
      });
      tick();

      expect(users.length).toBe(4);

      let newUser!: UserResponseDto;

      service
        .create({
          username: 'newuser',
          email: 'mail@mail.com',
          enabled: true,
        })
        .subscribe((u) => {
          newUser = u;
        });
      tick();

      expect(newUser.id).toBeDefined();
      expect(newUser.username).toBe('newuser');
      expect(newUser.email).toBe('mail@mail.com');
      //expect(newUser.role).toBe(Role.EURODAC);
      expect(newUser.enabled).toBeTrue();

      let usersAfterCreate!: UserResponseDto[];

      service.getAll().subscribe((u) => {
        usersAfterCreate = u;
      });
      tick();

      expect(usersAfterCreate.length).toBe(5);
    }));

    it('should update existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let updatedUser!: UserResponseDto | undefined;

      service
        .update('80f96bd2-d528-476a-9307-6eb6df4ab387', <UserRequestDto>{ username: 'updatedName' })
        .subscribe((u) => {
          updatedUser = u;
        });
      tick();

      expect(updatedUser).toBeDefined();
      expect(updatedUser!.id).toBe('80f96bd2-d528-476a-9307-6eb6df4ab387');
      expect(updatedUser!.username).toBe('updatedName');

      let usersAfterUpdate!: UserResponseDto[];

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

      let updatedUser!: UserResponseDto | undefined;

      service
        .update('non-existing-id', <UserRequestDto>{ username: 'updatedName' })
        .subscribe((u) => {
          updatedUser = u;
        });
      tick();

      expect(updatedUser).toBeUndefined();
    }));

    it('should delete existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      service.delete('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe(() => {});
      tick();

      let usersAfterDelete!: UserResponseDto[];

      service.getAll().subscribe((u) => {
        usersAfterDelete = u;
      });
      tick();

      expect(usersAfterDelete.length).toBe(3);
      const user = usersAfterDelete.find((u) => u.id === '80f96bd2-d528-476a-9307-6eb6df4ab387');
      expect(user).toBeUndefined();

      //TODO
      // Comprovar que si l'usuari eliminat era l'únic administrador, ara n'hi ha un altre
      // Comprovar que no es pugui eliminar el propi usuari actiu
    }));

    it('should do nothing when deleting non existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      service.delete('non-existing-id').subscribe(() => {});
      tick();

      let usersAfterDelete!: UserResponseDto[];
      service.getAll().subscribe((u) => {
        usersAfterDelete = u;
      });
      tick();

      expect(usersAfterDelete.length).toBe(4);
    }));

    /*
    it("No ha de poder eliminar l'usuari actiu", fakeAsync(() => {
      const auth = TestBed.inject(AuthService);
      const service = TestBed.inject(UserRepositoryService);

      // Preconditions

      // Simular estar logat amb l'usuari d'id '1'
      (auth as AuthMockService).applyBehavior({ userName: '80f96bd2-d528-476a-9307-6eb6df4ab387' });

      // Tests
      service.delete('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe({
        next: () => {
          fail("S'ha d'haver produït un error al eliminar l'usuari actiu");
        },
        error: () => {},
      });
      tick();
    }));*/
  });
});
