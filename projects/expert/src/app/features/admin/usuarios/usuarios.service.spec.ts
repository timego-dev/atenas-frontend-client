import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserRepositoryMockService, UserRepositoryService } from '@shared';
import { Role } from '@shared/auth/types/Role';
import { UserRequestDto } from '@shared/models/user/command/user-request.model';
import { UserResponseDto } from '@shared/models/user/query/user-response.model';
import { GroupDto, RoleDto, RoleType } from '@shared/models/user/user.shared';
import { AuthService } from '@shared/services/auth.service';
import { AuthMockService } from '@shared/services/mock/auth-mock.service';
import { CredentialsDto } from '@shared/models/user/user.shared';
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
      let ad;
      let users!: UserResponseDto[];

      service.getAll().subscribe((u) => {
        users = u;
      });
      tick();

      expect(users.length).toBe(4);
      // Comprobar que com a mínim hi ha un usuari amb rol administrador
      let admin = users.some((u) => u.firstName === 'Admin');
      expect(admin).toBeTrue;
      //TODO
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
        .subscribe({
          next(value) {
            expect(value).toBeDefined();
            updatedUser = value;
          },
          error(err) {
            fail();
          },
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

      const user = usersAfterUpdate.find((u) => u.id === '80f96bd2-d528-476a-9307-6eb6df4ab387');
      expect(user).toBeDefined();
      expect(user!.username).toBe('updatedName');
    }));

    it('should return 404 when updating non existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let updatedUser!: UserResponseDto | undefined;

      service.update('non-existing-id', <UserRequestDto>{ username: 'updatedName' }).subscribe({
        next(value) {
          fail('No pot actualitzar un usuari que no existeix');
        },
        complete() {},
        error(err: HttpErrorResponse) {
          expect(err.status).toBe(404);
        },
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
      // Comprovar que si l'usuari eliminat era l'únic administrador, ara n'hi ha un altre
      let admin = usersAfterDelete.some((u) => u.firstName === 'Admin');
      expect(admin).toBeFalse;
    }));

    it('should do nothing when deleting non existing user', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      service.delete('non-existing-id').subscribe({
        next(value) {
          fail();
        },
        error(err: HttpErrorResponse) {
          console.log(err);
          expect(err.status).toBe(404);
        },
      });
      tick();

      let usersAfterDelete!: UserResponseDto[];
      service.getAll().subscribe((u) => {
        usersAfterDelete = u;
      });
      tick();

      expect(usersAfterDelete.length).toBe(4);
    }));

    it('Comprovar que no es pugui eliminar el propi usuari actiu', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);
      const auth = TestBed.inject(AuthService);

      //fer login
      (auth as AuthMockService).applyBehavior({ userName: '80f96bd2-d528-476a-9307-6eb6df4ab387' });

      service.delete('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe({
        next(value) {
          fail();
        },
        error(err: HttpErrorResponse) {
          console.log(err);
          expect(err.status).toBe(404);
        },
      });
      tick();
    }));

    //SE TIENE QUE CAMBIAR
    it('should remove a role', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      const roles = {
        [RoleType.ADMINISTRATOR]: 'Administrador',
        [RoleType.ATENAS_CLIENT]: 'Cliente',
        [RoleType.EURODAC_CLIENT]: 'Eurodac',
        [RoleType.MBI_CLIENT]: 'MBI',
        [RoleType.OPERATOR]: 'Operador',
        [RoleType.SUPERVISOR]: 'Supervisor',
      };

      const role: RoleDto = {
        id: roles[RoleType.ADMINISTRATOR],
        name: RoleType.ADMINISTRATOR,
      };

      let users!: UserResponseDto[];

      service.deleteRole('80f96bd2-d528-476a-9307-6eb6df4ab387', role).subscribe({
        next(value) {},
        error(err) {
          fail();
        },
      });
    }));

    it('should add user to group', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let user!: UserResponseDto;

      service.getById('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe((u) => {
        user = u;
      });
      tick();

      service.addToGroup(user.id, 'a47fac6e-da2c-4f55-ae0b-df1e30ef8a8e').subscribe({
        next(value) {
          expect(user.groups?.map((a) => a.id)).toContain('a47fac6e-da2c-4f55-ae0b-df1e30ef8a8e');
        },
        error(err) {
          fail();
        },
      });
      tick;
    }));

    it('should delete user to group', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let user!: UserResponseDto;
      service.getById('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe((u) => {
        user = u;
      });
      tick();

      service.removeFromGroup(user.id, 'b7ecc368-737c-46da-9a7e-cefa0d6b3a27').subscribe(() => {});
      tick();
      expect(user.groups).toBeNull;
      expect(user.groups?.map((a) => a.id)).toBeFalse;
    }));

    it('should update your password', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      const pass: CredentialsDto = {
        type: 'prueba',
        value: 'valor',
        temporary: false,
      };

      let user!: UserResponseDto;

      service.getById('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe((u) => {
        user = u;
      });
      tick();

      service.updatePassword(user.id, pass).subscribe(() => {
        service.getById('80f96bd2-d528-476a-9307-6eb6df4ab387').subscribe((u) => {
          expect(user.credentials).toBeTruthy();
        });
      });
      tick();
    }));

    it('should obtain the user roles', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let roles!: RoleDto[];

      service.getAllRoles().subscribe((r) => {
        roles = r;
      });
      tick;

      expect(roles).toBeDefined;
      expect(roles.length).toBe(5);
    }));

    it('should get the user groups', fakeAsync(() => {
      const service = TestBed.inject(UserRepositoryService);

      let groups!: GroupDto[];
      service.getAllGroups().subscribe((g) => {
        groups = g;
      });
      tick;

      expect(groups).toBeDefined;
      expect(groups.length).toBe(2);
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
