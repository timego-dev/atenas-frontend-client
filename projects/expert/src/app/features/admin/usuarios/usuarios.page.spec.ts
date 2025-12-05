import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UsuariosPage } from './usuarios.page';
import {
  AuthMockService,
  AuthService,
  UserRepositoryMockService,
  UserRepositoryService,
} from '@shared';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

describe('Usuarios page', () => {
  let usuariosPage: UsuariosPage;
  let fixture: ComponentFixture<UsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [],
      providers: [
        { provide: UserRepositoryService, useClass: UserRepositoryMockService },
        { provide: AuthService, useClass: AuthMockService },
        provideNoopAnimations(),
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosPage);
    usuariosPage = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  describe('Page tests', () => {
    it('should be in initial state', () => {
      expect(usuariosPage.usuarios().length).toBe(4);

      expect(usuariosPage.editDialog).toBeFalse();
      expect(usuariosPage.editingUser).toBeDefined();
    });

    it('should edit user', fakeAsync(() => {
      const usuario = usuariosPage.usuarios()[0];
      usuariosPage.editUser(usuario);
      fixture.detectChanges();
      tick();
      expect(usuariosPage.editDialog).toBeTrue();
      expect(usuariosPage.selectedUser).toEqual(usuario);

      /* En cas de voler-ho fer a nivell de DOM
      const buttonGuardar = fixture.nativeElement.querySelector('p-button[label="Guardar"]');
      expect(buttonGuardar).toBeTruthy();
      const buttonCancelar = fixture.nativeElement.querySelector('p-button[label="Cancelar"]');
      expect(buttonCancelar).toBeTruthy();

      const textInputNombre = fixture.nativeElement.querySelector('input[id="nombre"]');
      expect(textInputNombre).toBeTruthy();
      expect(textInputNombre.value).toBe(usuario.username);

      const textInputEMail = fixture.nativeElement.querySelector('input[id="email"]');
      expect(textInputEMail).toBeTruthy();
      expect(textInputEMail.value).toBe(usuario.email);

      textInputNombre.value = 'Nombre modificado';
      textInputNombre.dispatchEvent(new Event('input'));

      textInputEMail.value = 'email.modificado@email.com';
      textInputEMail.dispatchEvent(new Event('input'));
      */

      expect(usuariosPage.editDialogComponent()).toBeDefined();

      usuariosPage.editDialogComponent()!.usuario().username = 'Nombre modificado';
      usuariosPage.editDialogComponent()!.usuario().email = 'email.modificado@email.com';

      // TODO: Completar campos restantes

      fixture.detectChanges();
      tick();
      expect(usuariosPage.editingUser!.username).toBe('Nombre modificado');
      expect(usuariosPage.editingUser!.email).toBe('email.modificado@email.com');

      // buttonGuardar.click();
      usuariosPage.guardar();

      fixture.detectChanges();
      tick();
      expect(usuariosPage.editDialog).toBeFalse();

      expect(usuariosPage.usuarios()[0].username).toBe('Nombre modificado');
      expect(usuariosPage.usuarios()[0].email).toBe('email.modificado@email.com');
    }));

    it('should add a new user', fakeAsync(() => {
      usuariosPage.openNew();
      fixture.detectChanges();
      tick();
      expect(usuariosPage.editDialog).toBeTrue();
      expect(usuariosPage.editingUser).toBeDefined();

      expect(usuariosPage.editDialogComponent()).toBeDefined();
      usuariosPage.editDialogComponent()!.usuario().username = 'NuevoUsuario';
      usuariosPage.editDialogComponent()!.usuario().email = 'mail@mail.com';
      //usuariosPage.editDialogComponent()!.usuario().role = Role.EURODAC;
      usuariosPage.editDialogComponent()!.usuario().enabled = true;
      fixture.detectChanges();
      tick();

      usuariosPage.guardar();
      fixture.detectChanges();
      tick();
      expect(usuariosPage.editDialog).toBeFalse();
      expect(usuariosPage.usuarios().length).toBe(5);
    }));
  });
});
